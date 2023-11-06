import { Row, Col } from "react-bootstrap";
import "./index.css"
import styles from "./indexStyle"

export default function StateCard({estado = [], window}) {
    return (
        <>
            <Col style={styles.ColEstados}>
                <Row>
                    <Col sm={(window.width <= 764) ? 0 : 5} style={styles.dvEst}>
                        <Row style={styles.RowEstateMinMax}>
                            <Col style={styles.ColEstateMinMax}>
                                <div style={styles.dvTempMax}>
                                    { parseInt(estado?.list[0].temp.max) }°
                                </div>
                            </Col>
                            <Col style={styles.ColEstateMinMax}>
                                <div style={styles.dvTempMin}>
                                    { parseInt(estado?.list[0].temp.min) }°
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {/* <Col sm={(window.width <= 764) ? 0 : 2} style={styles.dvEst}>
                        <div style={styles.dvTempMin}>
                            { parseInt(estado?.list[0].temp.min) }°
                        </div>
                    </Col> */}
                    <Col sm={(window.width <= 764) ? 0 : 6}  style={styles.dvEst}>
                        <div style={styles.dvNomeEstado}>
                            { estado.city.name }
                        </div>
                    </Col>
                </Row>
            </Col>
        </>
    );

  }