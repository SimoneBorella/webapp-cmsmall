import { Alert } from "react-bootstrap";

function PageNotFound() {
    return <>
        <br/>
        <Alert variant='danger'>
            <Alert.Heading>Error</Alert.Heading>
            Page not found
        </Alert>
    </>
}

export { PageNotFound };