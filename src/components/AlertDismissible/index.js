import { Alert } from "react-bootstrap";

export default function AlertDismissible ({show, setShow, messageTitle, message}) {
    if (show) {
        return (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{messageTitle}</Alert.Heading>
            <p>
                {message}
            </p>
            </Alert>
        );
    }
}