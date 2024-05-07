import { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Badge, Button, Form, Row, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./AppStyle"
import "./App.css"
import StateCard from '../components/StateCard';
import axios from 'axios';
import SearchResult from '../components/SearchResult';
import AlertDismissible from '../components/AlertDismissible';

export default function App() {
  const API_URL = "https://38mscp-8080.csb.app"
  const [estadosPadrao, setEstadosPadrao] = useState([])
  const [searchCity, setSearchCity] = useState([])
  const [regionCode, setRegionCode] = useState("")
  const [openSearchResult, setOpenSearchResult] = useState(false)
  const [cityField, setCityField] = useState("")
  const [diasSemana, setDiasSemana] = useState([])
  const window = useWindowDimensions()
  const [alertDismissible, setAlertDismissible] = useState(false)
  const [messageTitle, setMessageTitle] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [nextDaysIcons, setNextDaysIcons] = useState([])

  const inicialização = async () => {

    // <div dangerouslySetInnerHTML={}/>

    setLoading(true)
    await axios.post(`${API_URL}/get-weather`).then( (res) => {
      setEstadosPadrao(res.data)
      setLoading(false)
    })
  }

  const getCityWeather = async () => {
      // Para configuração do spinner
      setLoading(true)
      setRegionCode("")
      await axios.post(`${API_URL}/get-city-weather`, {city: cityField}).then( async (res) => {
        setSearchCity(res.data)
        
        let position = { lat: parseFloat(res.data.city.coord.lat), lng: parseFloat(res.data.city.coord.lon) }
        await axios.post(`${API_URL}/reverse-geocoding`, position).then(async (res) => {
          setRegionCode(res.data.data[0].region_code)
          setLoading(false)
        })
      })

      // Para configuração do spinner
      setLoading(true)
      setDiasSemana([])
      await axios.post(`${API_URL}/forecast-next-days`, {city: cityField}).then( async (res) => {
        //Buscar pelos Ícones dos dias seguintes
        let list = res.data?.list
        let iconsList = []

        for (let x = 0; x < list.length; x++) {
          if (list[x].dt_txt.split(" ")[1] === "12:00:00") {
            iconsList.push(list[x].weather[0].icon)
          }
        }
        if (iconsList.length === 4) {
          iconsList.push(list[list.length-1].weather[0].icon)
        }
        if (iconsList.length === 5) {
          iconsList.push(list[list.length-1].weather[0].icon)
        }

        setNextDaysIcons(iconsList)

        let st = ""
        let tempMaxMinDay = {}
        let diasSemana = []

        // Para pegar data atual no formato yyyy-mm-dd
        let data = new Date();
        let day = String(data.getDate()).padStart(2, '0');
        let month = String(data.getMonth() + 1).padStart(2, '0');
        let year = data.getFullYear();
        let currentDate = year + '-' + month + '-' + day;

        //Remover o primeiro dia que é o dia de hj pq não vou precisar dele
        for (let x=0; x < list.length; x++) {
          if (currentDate === list[x]?.dt_txt.split(" ")[0]) {
            list[x] = ''
          }
        }
        list = list.filter((i) => { return i })

        tempMaxMinDay = obterTempMaxMinAtualizada(list)

        let y = 0
        st = ""
        for (let x=0; x < list.length; x++) {
          if (list[x]?.dt_txt.split(" ")[0] !== st) {

            st = list[x]?.dt_txt.split(" ")[0]

            list[x].main.temp_max = tempMaxMinDay.temp_max[y]
            list[x].main.temp_min = tempMaxMinDay.temp_min[y]

            diasSemana.push(list[x])

            y++
          }
        }

        setDiasSemana(diasSemana)
        setLoading(false)
      })
  }

  const loadingScreen = () => {
    return (
      <>
        <Spinner animation="grow" variant="warning" />
      </>
    );
  }

  const obterTempMaxMinAtualizada = (list) => {
    let st = ""
    let maxsDay = []
    let minsDay = []
    let splitMaxsDay = []
    let z = 0

    //Separar a temperatura máxima de todos os dias que vierem de 'list' e joga em 'maxsDay'
    for (let x=0; x < list.length; x++) {
      if (list[x]?.dt_txt.split(" ")[0] !== st) {
        z++
      }

      maxsDay[z] += `${parseInt(list[x]?.main?.temp_max)}-`

      maxsDay[z] = maxsDay[z].replace("undefined", "")

      st = list[x]?.dt_txt.split(" ")[0]
    }
    maxsDay.shift(); //Remove o vazio no indice 0
    
    // Finaliza a separação da temp. max e min de todos os dias que vierem de 'list'
    for (let x=0; x < maxsDay.length; x++) {
      splitMaxsDay = maxsDay[x].split("-")
      splitMaxsDay = splitMaxsDay.filter((i) => {return i}) //Remove os valores false, vazios...

      maxsDay[x] = Math.max.apply(null, splitMaxsDay)
      minsDay[x] = Math.min.apply(null, splitMaxsDay)
    }

    maxsDay = { temp_max: maxsDay, temp_min: minsDay }

    return maxsDay
  }

  const mostraOpenSearchResult = () => {
    setOpenSearchResult(true)
  }
  const esconderOpenSearchResult = () => {
    setOpenSearchResult(false)
  }

  useEffect( () => {
    if (estadosPadrao.length === 0) {
      inicialização()
    }
  }, [estadosPadrao])

  return (
    <View style={styles.container}>
      
      <View style={(window.width <= 764) ? styles.contentContainerMob : styles.contentContainer}>
        
        <h1 style={styles.h1}>
            <b>Previsão do <Badge bg="warning">Tempo</Badge></b>
        </h1>

        <SearchResult loading={loading} loadingScreen={loadingScreen} searchCity={searchCity} regionCode={regionCode} openSearchResult={openSearchResult} esconderOpenSearchResult={esconderOpenSearchResult}  diasSemana={diasSemana} window={window} nextDaysIcons={nextDaysIcons}/> 

        <AlertDismissible show={alertDismissible} setShow={setAlertDismissible} messageTitle={messageTitle} message={message} />

        <Form className="d-flex" style={styles.searchForm}>
            <Form.Control
                size='sm'
                type="search"
                placeholder="Insira aqui o nome da cidade"
                style={styles.campoPesquisa}
                className="me-2"
                aria-label="Search"
                name='city_name'
                required={true}
                onChange={(e) => { setCityField(e.target.value) }}
            />
            <Button style={styles.searchButton} size='sm' className='btn btn-light' variant="primary" aria-controls='div-search-result' aria-expanded={openSearchResult} onClick={() => { if (cityField !== "") { getCityWeather(); mostraOpenSearchResult(); }else { setAlertDismissible(true); setMessageTitle("Erro:"); setMessage("O campo não pode ficar vazio!"); setOpenSearchResult(false)  } }} disabled={(estadosPadrao.length === 0 && loading === true) ? `disabled` : null}>
              {(estadosPadrao.length === 0 && loading === true)
              ? (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              )
              :
              (<>Procurar</>)
              }
            </Button>
        </Form>
        
        <hr style={styles.hr}/>
        
        <h2 style={styles.h2}>Capitais</h2>
        
        <div style={styles.divLoadingScreen}>
          { 
            (estadosPadrao.length === 0 && loading === true) ? loadingScreen() : null
          }
        </div>
        
        <div style={styles.parentList}>
          <Row xs={1} md={2}>
            {estadosPadrao.length > 0 ? estadosPadrao.map((estado, index) => {
              return (<StateCard estado={estado} key={index} window={window}/>)
            }) : null}
          </Row>
        </div>

        <div style={styles.footer}>
        © 2024 Copyright: <a href='https://www.linkedin.com/in/leandro-lobo-055b3918a/'>Leandro Lobo</a>
        </div>

      </View>
    </View>
  );
}