import { Spinner } from "react-bootstrap";

function CenteredSpinner(){
    return <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                }}>
                <Spinner animation="border" variant="success" />
            </div>;
}

export { CenteredSpinner };