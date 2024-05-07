import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        width:"100%",
        marginTop:10,
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
    },
    searchForm: {
        padding:10,
        marginTop: "2rem",
    },

    contentContainer:{
        width:"500px"
    },
    contentContainerMob:{
        width:"300px"
    },

    hr:{
        border:"1px solid #fff",
        marginTop:"1rem",
        marginBottom:"1rem"
    },
    h1:{
        // color:"white",
        textAlign:"center"
    },
    parentList: {
        width:'100%'
    },
    
    h2: {
        fontWeight: "bold",
        textAlign: "center",
    },
    h2Mob: {
        fontWeight: "bold",
        marginLeft:"15%",
        marginBottom:"2rem",
    },

    campoPesquisa: {
        // width:"15rem"
    },
    divLoadingScreen: {
        marginTop:"10px",
        textAlign:"center"
    },
    searchButton: {
        whiteSpace:"nowrap"
    },

    footer: {
        textAlign:"center",
        backgroundColor:'rgba(0, 0, 0, 0.2)',
        marginTop: '300px'
    }
});