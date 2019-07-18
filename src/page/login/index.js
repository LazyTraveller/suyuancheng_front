import React,{Component} from 'react'
import axios from 'axios'
import './index.css'
import "antd/dist/antd.css";
import { Modal, Button,Popconfirm, message } from 'antd';
import fun from '../../util/fun'
class Login extends Component{
    constructor(props){
        super(props)
        this.state={
            username:"",
            password:""
        }
    }
    inputChange(e){
        let key=e.target.name,
            value=e.target.value;
        this.setState({
            [key]:value
        })
    }
    onSubmit(){
        let doc=document.getElementsByClassName("userLogin")[0]
        let formData = new FormData(doc);
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        formData.append('username',this.state.username)
        formData.append('password',this.state.password)
        axios.post("/user/login",formData,config)
        .then(res=>{
            
            // localStorage.setItem('user',this.state.username)
            message.success("登陆成功，欢迎您")
            this.props.history.push('/info')
        },error=>{
            message.error("登陆失败")
            
        })
    }
    render(){
        return (
            <div style={{"height":"calc(100% - 1px)","background-image":"url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544601042216&di=5b2cc965735a1b4339a2fc9fb2c66684&imgtype=0&src=http%3A%2F%2Fwww.senssun.com%2Fupload%2Fimage%2F20160612%2F1465701805794073833.jpg')",
                        "background-size":"100% 100%","background-repeat":"no-repeat"}}>
                <div className="col-md-4 col-md-offset-4">

                    <div className="panel panel-default login">
                        <div className="panel-heading">欢迎登陆，溯源秤后台管理系统</div>
                        <div className="panel-body">
                            <form className="userLogin">
                                <div className="form-group">
                                    <input type="text" className="form-control"  placeholder="账号" name="username" onChange={e=>{this.inputChange(e)}} />
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" name="password" placeholder="密码"  onChange={e=>{this.inputChange(e)}} />
                                </div>
                                <button type="button" className="btn btn-primary btn-block" onClick={()=>{this.onSubmit()}}>登陆</button>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Login