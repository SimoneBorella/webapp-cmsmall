import { useEffect, useState, useContext } from "react";
import UserContext from './UserContext';
import { useParams, useNavigate} from "react-router-dom";
import { Container, Row, Col, ButtonGroup, Button, Image, Card, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { ArrowUp, ArrowDown, Pen, PlusCircle, Trash } from 'react-bootstrap-icons';
import { addContent, getPage, listContents, editContent, deleteContent } from "./API";


import {CenteredSpinner} from "./CenteredSpinner"


import banana from '/src/images/banana.jpeg'
import donuts from '/src/images/donuts.jpeg'
import dog from '/src/images/dog.jpeg'
import cat from '/src/images/cat.jpeg'

function PageContent(props) {
    const navigate = useNavigate() ;
    const user = useContext(UserContext) ;

    const { pageId } = useParams();

    const [page, setPage] = useState();
    const [contents, setContents] = useState();
    
    useEffect(() => {
        getPage(pageId).then((pag) => {
            if(pag.id == pageId){
                setPage(pag);
                listContents(pageId).then((conts) => {
                    // setTimeout(()=>{
                    setContents(conts);
                    setWaiting(false);
                    // }, 1000);
                });
            }
            else
            navigate('/error');
        });        
    }, [pageId]);
    

    const [waiting, setWaiting] = useState(true);


    const [errorMsg, setErrorMsg] = useState('') ;
    useEffect(()=>{
        if(errorMsg) {
            setTimeout(()=>{setErrorMsg('')}, 2000);
        }
    }, [errorMsg]);
    


    
    
    const [showAddModal, setshowAddModal] = useState(false);
    
    const handleShowAddModal = () => setshowAddModal(true);
    const handleCloseAddModal = () => setshowAddModal(false);
    
    
    
    const handleAddContent = async (type, value) => {
        setWaiting(true);
        const sortOrder = Math.max(...(contents.map((c)=>c.sortOrder))) + 1;
        await addContent(type, value, sortOrder, pageId)
        const conts = await listContents(pageId);
        setContents(conts);
        setshowAddModal(false);
        setWaiting(false);
    }
        
        
        
    

    const [editingContent, setEditingContent] = useState();
    const [showEditModal, setShowEditModal] = useState(false);

    const handleShowEditModal= async (c) => {
        setEditingContent(c);
        setShowEditModal(true)
    };

    const handleCloseEditModal = () => {
        setEditingContent();
        setShowEditModal(false);
    }

    
    const handleEditContent = async (value) => {
        setWaiting(true);
        await editContent(editingContent.id, editingContent.type, value, editingContent.sortOrder, pageId);
        const conts = await listContents(pageId);
        setContents(conts);
        setEditingContent();
        setShowEditModal(false);
        setWaiting(false);
    }
    





    const handleDeleteContent= async (c) => {
        const allowdDelete = (c.type === "header" && contents.filter(c => c.type === "header").length > 1) ||
        ((c.type === "text" || c.type === "image") && contents.filter(c => (c.type === "text" || c.type === "image")).length > 1);
        if(!allowdDelete)
        setErrorMsg("The page must contain at least one header and an image or text content");
        else {
            setWaiting(true);
            await deleteContent(c.id);
            const conts = await listContents(pageId);
            setContents(conts);
            setWaiting(false);
        }
    };
     

    const handleMove = async (c, dir) => {
        setWaiting(true);
        if(dir === 'up' || dir === 'down'){
            const delta = (dir==='up'? 1:-1) * Math.min(...(contents.filter((cc) => (dir==='up'? (c.sortOrder < cc.sortOrder): (c.sortOrder > cc.sortOrder)))
                .map((cc) => Math.abs(cc.sortOrder - c.sortOrder))));
            const cont = contents.find((cc) => cc.sortOrder === c.sortOrder + delta);
            if(cont){
                await editContent(c.id, c.type, c.value, cont.sortOrder, pageId);
                await editContent(cont.id, cont.type, cont.value, c.sortOrder, pageId);
                const conts = await listContents(pageId);
                setContents(conts);
            }
        }
        setWaiting(false);
    }

    if(!page || !contents)
        return <CenteredSpinner/>;


    const edit = user && (user.role === "admin" || user.name === page.author);


    return (
        <>
        <Container>
            <Row>
                <Col><h1>{page.title}</h1></Col>
                <Col className="text-end">Creation: {page.creationDate.format('DD-MM-YYYY')}<br/>Publication: {page.pubDate? page.pubDate.format('DD-MM-YYYY') : '-'}</Col>
            </Row>
            <Row>
                <i>Author: {page.author}</i>
                <hr/>
            </Row>

            <ContentList contents={contents} edit={edit} waiting={waiting}
                handleDeleteContent={handleDeleteContent} handleShowEditModal={handleShowEditModal} handleMove={handleMove}/>

            <br/><br/><br/><br/><br/><br/>
        </Container>

        { edit && <AddContentButton handleShowAddModal={handleShowAddModal}/>}
        {!showAddModal && !showEditModal && errorMsg && <CenteredAlert errorMsg={errorMsg}/>}

        <AddContentModal show={showAddModal} handleAddContent={handleAddContent} handleClose={handleCloseAddModal}/>
        <EditContentModal show={showEditModal} editingContent={editingContent} handleEditContent={handleEditContent} handleClose={handleCloseEditModal}/>
        </>
    );
}






function ContentList(props){
    return props.contents.sort((a, b) => a.sortOrder - b.sortOrder)
        .map((c) => {
            let cont;
            if(c.type === "header")
                cont = <h2>{c.value}</h2>;
            else if(c.type === "text")
                cont = <p>{c.value}</p>;
            else if(c.type === "image")
                cont = <Col className="text-center"><Image src={c.value} fluid rounded /></Col>;

            if(!props.edit)
                return <Row key={c.id}> <Col style={{"wordWrap": "break-word"}}>{cont}</Col></Row>
            else
                return  <Card key={c.id} style={{"marginBottom": "1rem"}}>
                            <Card.Body>
                                {cont}
                            </Card.Body>
                            <Card.Footer className="text-end">
                                <ButtonGroup>
                                    <Button variant="danger" disabled={props.waiting} onClick={()=>props.handleDeleteContent(c)}><Trash/></Button>
                                    <Button variant="warning" disabled={props.waiting} onClick={()=>props.handleShowEditModal(c)}><Pen/></Button>
                                    {c.sortOrder>0 && <Button variant="primary" disabled={props.waiting} onClick={()=>props.handleMove(c, "down")}><ArrowUp/></Button>}
                                    {c.sortOrder< Math.max(...(props.contents.map((c)=>c.sortOrder))) && <Button variant="primary" disabled={props.waiting} onClick={()=>props.handleMove(c, "up")}><ArrowDown/></Button>}
                                </ButtonGroup>
                            </Card.Footer>
                        </Card>
        });
}







function AddContentModal(props){
    const [type, setType] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {
        setType('');
        setValue('');
    }, [props.show])

    const [errorMsg, setErrorMsg] = useState('') ;
    useEffect(()=>{
        if(errorMsg) {
            setTimeout(()=>{setErrorMsg('')}, 2000);
        }
    }, [errorMsg]);


    const handleAddContent = () => {
        if(!type)
            setErrorMsg("Type not selected");
        if(!value)
            setErrorMsg((type==="image"? "Content image not selected": "Empty content field"));
        else{
            props.handleAddContent(type, value);
        }
    }

    return <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>New content</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="contentType">
                    <Form.Label>Type</Form.Label>
                    <Form.Select onChange={(ev => {setType(ev.target.value)})}>
                        <option value=''>Choose a type</option>
                        <option value="header">Header</option>
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                    </Form.Select>
                    </Form.Group>
                    <ContentForm type={type} value={value} handleValue={(v)=>setValue(v)}/>
                </Form>
                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleAddContent}>
                    Save
                </Button>
                </Modal.Footer>
            </Modal>
}







function EditContentModal(props) {
    const [value, setValue] = useState('');

    useEffect(() => {
        setValue(props.editingContent? props.editingContent.value: '');
    }, [props.show])

    const [errorMsg, setErrorMsg] = useState('') ;
    useEffect(()=>{
        if(errorMsg) {
            setTimeout(()=>{setErrorMsg('')}, 2000);
        }
    }, [errorMsg]);

    const handleEditContent = () => {
        if(!value)
            setErrorMsg((props.editingContent.type==="image"? "Image not selected": "Empty content field"));
        else{
            props.handleEditContent(value);
        }
    }

    return <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Edit content</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <ContentForm type={props.editingContent? props.editingContent.type: ''} value={value} handleValue={(v)=>setValue(v)}/>
                </Form>
                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleEditContent}>
                    Save
                </Button>
                </Modal.Footer>
            </Modal>
}









function ContentForm(props){
    if(props.type === "header")
        return <Form.Group className="mb-3" controlId="contentVal">
                    <Form.Label>Content</Form.Label>
                    <Form.Control value={props.value} type="text" placeholder="Header content" autoFocus
                    onChange={(ev => {props.handleValue(ev.target.value)})}/>
                </Form.Group>;
    else if(props.type === "text")
        return <Form.Group className="mb-3" controlId="contentVal">
                    <Form.Label>Content</Form.Label>
                    <Form.Control value={props.value} type="text" as="textarea" rows={10} placeholder="Text content" autoFocus
                    onChange={(ev => {props.handleValue(ev.target.value)})}/>
                </Form.Group>;
    else if(props.type==="image")
        return <Form.Group className="mb-3" controlId="contentVal">
                    <Form.Label>Content</Form.Label>
                    <Form.Select value={props.value} onChange={(ev => {props.handleValue(ev.target.value)})}>
                        <option value=''>Choose a image</option>
                        <option value={banana}>Banana</option>
                        <option value={donuts}>Donuts</option>
                        <option value={dog}>Dog</option>
                        <option value={cat}>Cat</option>
                    </Form.Select>
                </Form.Group>;
}






function AddContentButton(props){
    return <Button variant='success' style={{
                position: 'fixed',
                top: '94%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '86%',
                height: '5%',
                minHeight: '2.5rem'
            }} onClick={props.handleShowAddModal}>
                <PlusCircle/>
            </Button>;
}

function CenteredAlert(props){
    return <div style={{
                    position: 'fixed',
                    top: '86%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}>
                <Alert variant="danger">{props.errorMsg}</Alert>
            </div>;
}


export { PageContent };