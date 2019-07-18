import { Modal, Button,Popconfirm, message } from 'antd';
import "antd/dist/antd.css";
import React,{Component}  from 'react'
import axios from 'axios'
export default class Update extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    handleOk=(e)=>{
        axios.post("/api/rest/market/",{
            "name":this.state.update_name,
            "address":this.state.update_name,
            "remark":this.state.update_remark
        })
        .then(res=>{
            message.success('编辑成功')
            this.props.createMarketChangeVisible()
        },err=>{
            message.error("输入有误，请重新输入")
        })     
    }
    handleCancel = (e) => {
        message.error('编辑已取消');
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
          title="编辑市场"
          okText="确定"
          cancelText="取消"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            <tr>
                <td><input type="text" class="form-control input update" name="update_name"  placeholder="名称"onChange={e=>{this.handleUpdate(e)}}/></td>
                <td><input type="text" class="form-control input update" name="update_address" placeholder="地址"onChange={e=>{this.handleUpdate(e)}}/></td>
                <td><input type="text" class="form-control input update" name="update_remark"  placeholder="备注"onChange={e=>{this.handleUpdate(e)}}/></td>
            </tr> 
        </Modal>
        )
    }
}