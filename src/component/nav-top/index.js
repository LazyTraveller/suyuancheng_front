import React,{Component}from 'react'
import {Link} from 'react-router-dom'
import fun from '../../util/fun'
import fun_select from '../select'
import axios from 'axios';
export default class NavTop extends Component{
    constructor(props){
        super(props);
        this.state={
            username:"",
            role:"",
            AdminName:""
        }
    }
    onLogout(){
        axios.get("/user/logout")
        .then(res=>{
            if(fun.removeLocalStorage('user')){
                fun.removeLocalStorage('user');
                window.location.href="/login";
            }else{
                window.location.href="/login";
            } 
            
        })
       
    }
    componentDidMount(){
        axios.get("/api/rest/user/user-info")   
        .then(res=>{
            if(fun_select.select(res.data.roles)=="STORE_MANAGER"){
                this.setState({
                    AdminName:res.data.store.name,
                    role:fun_select.select(res.data.roles)
                })
            }
            else if(fun_select.select(res.data.roles)=="MARKET_MANAGER"){
                this.setState({
                    AdminName:res.data.market.name,
                    role:fun_select.select(res.data.roles)
                })
            }
            else if(fun_select.select(res.data.roles)=="ADMINISTRATOR"){
                this.setState({
                    username:res.data.username,
                    AdminName:res.data.username,

                    
                    // AdminName:res.data.market.name,
                    role:fun_select.select(res.data.roles)
                })
            }
            
        })
        if(fun.getLocalStorage('user')){
            this.setState({
                username:fun.getLocalStorage('user')
            })
        }else{
            return 
        }
        
        
    }
    render(){
        return(
        <div className="navbar navbar-default top-navbar" role="navigation">
            <div className="navbar-header" style={{background:"#002140;"}}>
                <Link className="navbar-brand" to="/info" exact><b>溯源秤</b>后台管理</Link>
            </div>

            <ul className="nav navbar-top-links navbar-right">
                
                <li className="dropdown">
                    <a className="dropdown-toggle" data-toggle="dropdown" href="javascript:;" aria-expanded="false">
                        <i className="fa fa-user fa-fw"></i>
                        {
                            this.state.username
                                ?<span>欢迎您 ，{this.state.username}</span>
                                :<span>欢迎{this.state.username}</span>
                        }
                        <i className="fa fa-caret-down"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-user">
                        <li>
                        
                                <i className="user"></i> 
                                {this.state.role=="STORE_MANAGER"?<a ><span>所管理商铺名称：{this.state.AdminName}</span></a>:null }
                                {this.state.role=="MARKET_MANAGER"?<a ><span>所管理市场名称：{this.state.AdminName}</span></a>:null }
                                {this.state.role=="ADMINISTRATOR"?<a ><span>系统管理员</span></a>:null }
                            
                        </li>
                        <li>
                            <a onClick={()=>{this.onLogout()}}>
                                <i className="fa fa-sign-out fa-fw"></i> 
                               <span>退出登陆</span> 
                            </a>
                        </li>
                    </ul>
                    
                </li>
               
            </ul>
        </div>)
    }
}