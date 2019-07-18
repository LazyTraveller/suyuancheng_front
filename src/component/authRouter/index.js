import React,{Component} from 'react'
import axios from 'axios'
import{withRouter} from 'react-router-dom'

 class AuthRouter extends Component{
    constructor(props){
        super(props)
    }
   componentDidMount(){
      axios.get("/api/rest/user/user-info")
      .then(res=>{
          let pathname=this.props.location.pathname;
          if(pathname=='/'){
              this.props.history.push("/info")
          }else{
            this.props.history.push(pathname)
          }
          
      },()=>{
        this.props.history.push("/login")
      })
  }    render(){
        return null
    }
}
export default withRouter(AuthRouter)