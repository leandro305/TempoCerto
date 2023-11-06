import { ArrowUp, ArrowDown } from "react-bootstrap-icons"
import styles from "./indexStyle"
import { CloseButton, Collapse, Row, Col } from "react-bootstrap"

const SearchResult = ({openSearchResult, esconderOpenSearchResult, searchCity, diasSemana, window}) => {
    const toAllUppercase = (phrase) => {
      const spPhrase = phrase.split(" ")
      for (let i = 0; i < spPhrase.length; i++) {
        if (spPhrase[i].length !== 1 && spPhrase[i].length !== 2){
          spPhrase[i] = spPhrase[i][0].toUpperCase() + spPhrase[i].substr(1)
        }
      }
      return spPhrase.join(' ')
    }


    const name = searchCity?.city?.name
    let description = searchCity?.list ? searchCity?.list[0]?.weather[0]?.description : null;
    const speed = searchCity?.list ? parseInt(((searchCity?.list[0]?.speed) * 360) / 100) : null //Como a velocidade vem em m/s, converto-a p/ km/h
    
    if (description) {
      description = toAllUppercase(description)
    }
  
    const obterDiaSemana = (value) => {
      let diaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
      let sp = value.split("-")
      let result = new Date(sp[0], sp[1] - 1, sp[2])
      let day = result.getDay()
      return diaSemana[day]
    }

    const renderDiasSemana = () => {
      let ds = diasSemana.map((dia, k) => {
        return (
          <Col key={k}>
          {obterDiaSemana(dia?.dt_txt.split(" ")[0])}<br/>
          <span style={styles.minMaxDiasSemana}>{parseInt(dia?.main?.temp_max)}°</span>
          <span style={styles.minMaxDiasSemana}>{parseInt(dia?.main?.temp_min)}°</span>
          </Col>
        )
      })
      return ds
    }

    return (
      <Collapse in={openSearchResult} style={styles.divSearchResult}>
      <div id="div-search-result">
        <div style={styles.divSearchTitle}>
        {name}, RR - {searchCity?.city?.country} 
        </div>

        <div style={styles.divSearchBtnClose}>
          <CloseButton onClick={() => { esconderOpenSearchResult() }}/>
        </div>

        <br/>

        <div>
          <h1 style={styles.titleDegreeDescriptions}>{searchCity?.list ? parseInt(searchCity?.list[0]?.temp?.day) : null }°C {description} </h1>
        </div>

        <Row style={styles.margBottMob}>
          <Col sm={2} style={(window.width <= 764) ? styles.resultSeachColsMob : null}>
            <ArrowUp color="#ff7f00"/>
            {searchCity?.list ? parseInt( searchCity?.list[0]?.temp?.max) : null}°
          </Col>
          <Col sm={2} style={(window.width <= 764) ? styles.resultSeachColsMob: null}>
            <ArrowDown color="#0074AD"/>
            {searchCity?.list ? parseInt( searchCity?.list[0]?.temp?.min) : null}°
          </Col>

          <Col sm={4} style={(window.width <= 764) ? styles.resultSeachColsMob : null}>
            <span style={styles.fontHeigNormal} >Sensação</span> {searchCity?.list ? parseInt( searchCity?.list[0]?.feels_like?.day) : null}°C
          </Col>
        </Row>
        <Row style={styles.margBottMob}>
          <Col sm={4} style={(window.width <= 764) ? styles.resultSeachColsMob : null}>
            <span style={styles.fontHeigNormal} >Vento</span> {speed}Km/h
          </Col>
          <Col sm={4}  style={(window.width <= 764) ? styles.resultSeachColsMob : null}>
            <span style={styles.fontHeigNormal} >Umidade</span> {searchCity?.list ? parseInt( searchCity?.list[0]?.humidity ) : null}%
          </Col>
        </Row>

        <hr />

        <Row style={(window.width <= 764) ? styles.rowDaysOfTheWeekMob : null}>
        {renderDiasSemana()}
        </Row>

      </div>
      </Collapse>
    )
  }
  
  export default SearchResult