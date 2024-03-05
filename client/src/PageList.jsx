import { useEffect, useState, useContext } from "react";
import UserContext from './UserContext';
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Modal, Alert, Spinner} from 'react-bootstrap';
import { Trash, ArrowRight, PlusCircle, Pen } from 'react-bootstrap-icons';
import { listUsers, addPage, editPage, listPages, deletePage, addContent } from './API';
import dayjs from 'dayjs';


import {CenteredSpinner} from "./CenteredSpinner"


function PageList(props) {
    const user = useContext(UserContext) ;
    
    const [pages, setPages] = useState();

    useEffect(() => {
        // setTimeout(()=>{
        listPages().then((pages) => setPages(pages));
        // }, 1000);
    }, []);

    const [showAddModal, setshowAddModal] = useState(false);
    
    const handleshowAddModal = () => setshowAddModal(true);
    const handleCloseAddModal = () => setshowAddModal(false);



    
    const [editingPage, setEditingPage] = useState();
    const [showEditModal, setShowEditModal] = useState(false);
    
    const handleShowEditModal = (p) => {
        setEditingPage(p);
        setShowEditModal(true)
    };
    
    const handleCloseEditModal = () => {
        setEditingPage();
        setShowEditModal(false);
    }

    const handleEditPage = async (title, author, pubDate) => {
        await editPage(editingPage.id, title, author, pubDate);
        const pages = await listPages();
        setPages(pages);
        setEditingPage();
        setShowEditModal(false);
    }


    
    
    const [pageWaiting, setPageWaiting] = useState(-1);
    const handleDeletePage= async (p) => {
        setPageWaiting(p.id);
        await deletePage(p.id);
        const pags = await listPages();
        setPages(pags);
        setPageWaiting(-1);
    };
    

    if(!pages)
        return <CenteredSpinner/>;
    
    
    return (
        <>
        <Container>
            <PagesGrid pages={pages} user={user} pageWaiting={pageWaiting} handleshowAddModal={handleshowAddModal} handleDeletePage={handleDeletePage} handleShowEditModal={handleShowEditModal}/>
        </Container>

        <AddPageModal show={showAddModal} user={user} handleClose={handleCloseAddModal}/>
        <EditPageModal show={showEditModal} user={user} editingPage={editingPage} handleEditPage={handleEditPage} handleClose={handleCloseEditModal}/>
        </>
    );
}











function PagesGrid(props){
    const navigate = useNavigate() ;

    const handleOpen= (p) => {
        navigate(`/pages/${p.id}`)
    };


    let sortedPages = [...props.pages];

    if(!props.user || (props.user.role!="admin"))
        sortedPages = sortedPages.filter((p) => (props.user && props.user.name === p.author) || (p.pubDate && p.pubDate.isBefore(dayjs())));
    sortedPages.sort((a, b) => {
        if(!a.pubDate)
            return -1;
        else if (!b.pubDate)
            return 1;
        else
            return (a.pubDate.isBefore(b.pubDate)? 1:-1);
    });

    
    
    return <Row className="mb-4">
        {props.user &&
            <Col className="p-2" key={-1} md={4}>
                <Button variant='outline-success' className="w-100 h-100" style={{"fontSize": '2rem'}} onClick={props.handleshowAddModal}><PlusCircle/></Button>
            </Col>
        }
        {sortedPages.map((p) => {
            const edit = props.user && (props.user.name == p.author || props.user.role==="admin");
            
            return <Col className="p-2" key={p.id} md={4}>
                <Card border="success">
                    <Card.Body>
                        <Card.Title>{p.title}</Card.Title>
                        <Card.Subtitle><i>{p.author}</i></Card.Subtitle>
                        <Card.Text>{(p.pubDate? p.pubDate.format('DD-MM-YYYY') : '-')}</Card.Text>
                    </Card.Body>
                    <Card.Footer >
                        {props.pageWaiting!=p.id? <Row>
                            {edit && <Col><Button variant='danger' onClick={() => props.handleDeletePage(p)}><Trash/></Button></Col>}
                            {edit && <Col className="text-center"><Button variant='warning' onClick={() => props.handleShowEditModal(p)}><Pen/></Button></Col>}
                            <Col className="text-end"><Button variant='success' onClick={() => handleOpen(p)}><ArrowRight/></Button></Col>
                        </Row> :
                        <Row><Col className="text-center"><Spinner animation="border" variant="success" /></Col></Row>}
                    </Card.Footer>
                </Card>
            </Col>;
        })}
    </Row>;

}






function AddPageModal(props){
    const navigate = useNavigate() ;

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [pubDate, setPubDate] = useState();

    useEffect(()=>{
        setTitle('');
        setAuthor((props.user? props.user.name : ''));
        setPubDate();
    }, [props.show])

    const [errorMsg, setErrorMsg] = useState('') ;
    useEffect(()=>{
        if(errorMsg) {
            setTimeout(()=>{setErrorMsg('')}, 2000);
        }
    }, [errorMsg]);


    const handleAddPage = async () => {
        const users = await listUsers();
        if(!title)
            setErrorMsg('Empty title field');
        else if (!users.find((u) => u.name === author))
            setErrorMsg("Inserted author doesn't exist");
        else{
            const pageId = await addPage(title, author, dayjs().format('YYYY-MM-DD'), pubDate);
            await addContent("header", "Header", 0, pageId);
            await addContent("text", "Text", 1, pageId);
            navigate(`/pages/${pageId}`);
            props.handleClose();
        }
    }

    const editAuthor = props.user && props.user.role==="admin";

    return <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>New page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="pageTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control value={title} type="text" placeholder="Page title" autoFocus
                        onChange={(ev => {setTitle(ev.target.value)})}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pageAuthor">
                    <Form.Label>Author</Form.Label>
                    <Form.Control value={author} disabled={!editAuthor} type="text" placeholder="Page author" autoFocus
                        onChange={(ev => {setAuthor(ev.target.value)})}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pagePubDate">
                    <Form.Label>Publication date</Form.Label>
                    <Form.Control value={pubDate} type="date" autoFocus
                        onChange={(ev => {setPubDate(ev.target.value)})}/>
                    </Form.Group>
                    
                </Form>
                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleAddPage}>
                    Save
                </Button>
                </Modal.Footer>
            </Modal>
}








function EditPageModal(props){
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [pubDate, setPubDate] = useState();

    useEffect(()=>{
        setTitle(props.editingPage? props.editingPage.title: '');
        setAuthor(props.editingPage? props.editingPage.author : '');
        setPubDate(((props.editingPage && props.editingPage.pubDate)? props.editingPage.pubDate.format('YYYY-MM-DD') : undefined));
    }, [props.show])


    const [errorMsg, setErrorMsg] = useState('') ;
    useEffect(()=>{
        if(errorMsg) {
            setTimeout(()=>{setErrorMsg('')}, 2000);
        }
    }, [errorMsg]);


    const handleEditPage = async () => {
        const users = await listUsers();
        if(!title)
            setErrorMsg('Empty title field');
        else if (!users.find((u) => u.name === author))
            setErrorMsg("Inserted author doesn't exist");
        else{
            props.handleEditPage(title, author, pubDate);
        }
    }

    const editAuthor = props.user && props.user.role==="admin";


    return <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Edit page properties</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="pageTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control value={title} type="text" placeholder="Page title" autoFocus
                        onChange={(ev => {setTitle(ev.target.value)})}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pageAuthor">
                    <Form.Label>Author</Form.Label>
                    <Form.Control value={author} disabled={!editAuthor} type="text" placeholder="Page author" autoFocus
                        onChange={(ev => {setAuthor(ev.target.value)})}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pagePubDate">
                    <Form.Label>Publication date</Form.Label>
                    <Form.Control value={pubDate} type="date" autoFocus
                        onChange={(ev => {setPubDate(ev.target.value)})}/>
                    </Form.Group>
                </Form>
                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleEditPage}>
                    Save
                </Button>
                </Modal.Footer>
            </Modal>;
}


export { PageList };
