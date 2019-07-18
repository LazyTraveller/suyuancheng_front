import { Modal, Button,Popconfirm, message } from 'antd';
import "antd/dist/antd.css";
import React,{Component}  from 'react'
import axios from 'axios'
export default class Add extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    handleOk=(e)=>{
        let config=this.props.config;
        let data;
        if(this.props.trade){

        }
        if(config=='address'){
            data=JSON.stringify({
                name:this.state.update_name,
                address:this.state.update_address,
                remark:this.state.update_remark
            })
        }else{
            data=JSON.stringify({
                marketId:this.state.update_name,
                name:this.state.update_address,
                remark:this.state.update_remark
            })
        }
        
        if(this.props.suyuancheng){
            let data=JSON.stringify({
                storeId:this.state.update_name,
                name:"vX9t",
                remark:"huba4fLVEIPnu7ZXdmxC"
            })
            axios.post(this.props.url,data,{
                headers:{
                    'Content-Type':'application/json;charset=utf-8'
                }
            })
            .then(res=>{
                message.success('添加成功')
                this.props.createMarketChangeVisible()
                this.props.addTrue()
            },err=>{
                message.error("输入有误，请重新输入")
            })
        }else{
            axios.post(this.props.url,data,{headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }})
            .then(res=>{
                message.success('添加成功')
                this.props.createMarketChangeVisible()
                this.props.addTrue()
            },err=>{
                message.error("输入有误，请重新输入")
            })
        }
       
    }
    handleCancel = (e) => {
        message.error('添加已取消');
            this.props.createMarketChangeVisible()
      }
    handleUpdate=(e)=>{
        let name=e.target.name;
        let value=e.target.value;
        this.setState({
            [name]:value
        })
      }
    render(){
        return (
            <Modal
          title={this.props.title}
          okText="确定"
          cancelText="取消"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            <tr>
            {
                    this.props.suyuancheng? <td><span>名称：</span><input type="text" class="form-control input update" style={{width:230}}name="update_name"   onChange={e=>{this.handleUpdate(e)}}/></td>:
                    <td><span>名称：</span><input type="text" class="form-control input update" name="update_name"   onChange={e=>{this.handleUpdate(e)}}/></td>
            }
                
                {
                    this.props.provider?null:<td><span>地址：</span><input type="text" class="form-control input update" name="update_address" onChange={e=>{this.handleUpdate(e)}}/></td>
                }
                {
                    this.props.suyuancheng?null:

                <td><span>备注：</span><input type="text" class="form-control input update" name="update_remark"  onChange={e=>{this.handleUpdate(e)}}/></td>
                }
            </tr> 
        </Modal>
        )
    }
}