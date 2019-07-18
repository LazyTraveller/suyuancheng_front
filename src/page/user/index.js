import React,{Component} from 'react'
import axios from 'axios'
import {Card,Row,Col,Input,Button,Select,Modal,message,Popconfirm,TreeSelect,Spin} from 'antd'
import{Link}from 'react-router-dom'
import Pagination from 'rc-pagination';
import 'rc-pagination/dist/rc-pagination.min.css'
const Option=Select.Option
const SHOW_PARENT=TreeSelect.SHOW_PARENT

export default class User extends Component{
    constructor(props){
        super(props)
        this.state={
            userList:[],
            data_market:[],
            data_market_admin:[],
            treeData:[],    
            totalElements:1,
            totalPages:1,
            page_number:1,
            find_name:"",
            query_marketId:"",
            add_visible:false,
            update_marketId:"",
            update_name:"",
            update_username:"",
            update_pwd:"",
            update_no:"",
            treeValue:"",
            visible:false
        }
    }
    componentDidMount(){
        axios.get('/api/rest/market/')
            .then(res=>{
                if(res.status==302){
                    this.props.history.push('/login')
                }
                let query_marketId=res.data.content[0].uuid
                this.setState({
                    data_market:res.data.content,
                    loading:false,
                    // query_marketId
                },()=>{
                    axios.get("/api/rest/market-admin/")
                    .then(res=>{
                        let data=res.data.content,
                            totalElements=res.data.totalElements,
                            totalPages=res.data.totalPages
                            
                        this.setState({
                            data_market_admin:data,
                            totalElements,
                            totalPages,
                            
                        })
                        
                    })
                })
            },()=>{
                this.props.history.push('/login')
            })
        
        axios.get("/api/rest/user/")
        .then(res=>{
            // console.log(res.data); 
        })
    }
    changeNumber(pageNum){
        this.setState({
            page_number:pageNum,
        },()=>{
            axios.get('/api/rest/market-admin/?page='+(pageNum-1)+"&marketId="+this.state.query_marketId)
            .then(res=>{
                let data=res.data.content;
                this.setState({
                    data_market_admin:data
                })
            })
        })}
    inputFind=(e)=>{
        this.setState({
            find_name:e.target.value
        })
    }
    doReset=()=>{
        axios.get("/api/rest/market-admin/")
        .then(res=>{
            let data=res.data.content,
                totalElements=res.data.totalElements,
                totalPages=res.data.totalPages;
            this.setState({
                data_market_admin:data,
                totalElements,
                totalPages,
                find_name:"",
                query_marketId:""
            })   
        })
    }
    doFind=()=>{
        if(this.state.find_name.length>0&&this.state.query_marketId){
            axios.get("/api/rest/market-admin/?realName="+this.state.find_name+"&marketId="+this.state.query_marketId)
        .then(res=>{
            let data=res.data.content,
                totalElements=res.data.totalElements,
                totalPages=res.data.totalPages;
                this.setState({
                data_market_admin:data,
                totalElements,
                totalPages
            })  
        })
        }else if(this.state.find_name.length>0&&!this.state.query_marketId){
            axios.get("/api/rest/market-admin/?realName="+this.state.find_name)
        .then(res=>{
            let data=res.data.content,
                totalElements=res.data.totalElements,
                totalPages=res.data.totalPages;
                this.setState({
                data_market_admin:data,
                totalElements,
                totalPages
            })  
        })
        }else if(this.state.find_name.length<=0&&this.state.query_marketId){
            axios.get("/api/rest/market-admin/?marketId="+this.state.query_marketId)
            .then(res=>{
            let data=res.data.content,
                totalElements=res.data.totalElements,
                totalPages=res.data.totalPages;
                this.setState({
                data_market_admin:data,
                totalElements,
                totalPages
            })  
        })
        }else{
            return 
        }
    }
    handleChange=(e)=>{
        this.setState({
            query_marketId:e
        })
    }
    createMarket=()=>{
        this.setState({
            add_visible:true,
            page_number:1
        })
    }
    add_handleCancel=()=>{
        this.setState({
            add_visible:false
        })
    }
    handleUpdate=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    handleUpdateSelect=e=>{
        this.setState({
            update_marketId:e
        })
    }
    add_handleOk=()=>{
        let readyData={
            username:this.state.update_username,
            password:this.state.update_pwd,
            realName:this.state.update_name,
            marketId:this.state.update_marketId
        }
        let header={
            headers:{
                'Content-Type':"application/json;charset=utf-8"
            }
        }
        axios.post('/api/rest/market-admin/',readyData,header)
        .then(res=>{
            axios.get("/api/rest/market-admin/?marketId="+this.state.query_marketId)
            .then(res=>{
                message.success("添加成功")
                let data=res.data.content,
                    totalElements=res.data.totalElements,
                    totalPages=res.data.totalPages;
                    this.setState({
                    data_market_admin:data,
                    totalElements,
                    totalPages,
                    update_marketId:"",
                    update_name:"",
                    update_pwd:"",
                    update_username:"",
                    add_visible:false
                }) 
        })
    },()=>{
        message.error("添加错误，请重试")
    })
}
add_handleCancel=()=>{
    this.setState({
        add_visible:false,
        update_marketId:""
    })
}
doDelete=(e)=>{
    this.setState({
        update_no:e.target.parentNode.parentNode.getAttribute("name")
    })
}
confirm=()=>{
    let id=this.state.data_market_admin[this.state.update_no].id
    axios.delete('/api/rest/market-admin/'+id)
    .then(res=>{
        axios.get("/api/rest/market-admin/?marketId="+this.state.query_marketId)
        .then(res=>{
            let data=res.data.content,
                totalElements=res.data.totalElements,
                totalPages=res.data.totalPages;
                this.setState({
                data_market_admin:data,
                totalElements,
                totalPages
            })
            axios.get('/api/rest/market/')
            .then(res=>{
                this.setState({
                    data_market:res.data.content
                })
            })
        })
    })
}
doUpdate=(e)=>{
    let realName=this.state.data_market_admin[e.target.parentNode.parentNode.getAttribute("name")].realName,
        treeData=this.state.data_market_admin[e.target.parentNode.parentNode.getAttribute("name")].roles;
    this.setState({
        update_no:e.target.parentNode.parentNode.getAttribute("name"),
        update_name:realName,
        visible:true,
        treeData
    })
}
handleCancel=()=>{
    this.setState({
        visible:false,
        update_name:""
    })
}
onChange = (value) => {
    this.setState({ treeValue:value });
  }
handleOk=()=>{
    let realName=this.state.update_name;
    let roles=[];
    roles=this.state.treeValue;
    let id=this.state.data_market_admin[this.state.update_no].id;
    let header={
        headers:{
            'Acontent-Type':'application/json;charset=utf-8'
        }
    }
    if(roles.indexOf("MARKET_MANAGER")<0){
        roles.unshift("MARKET_MANAGER")
    }
    let readyData={
        realName,
        roles
    }
        axios.put('/api/rest/market-admin/'+id,readyData,header)
        .then(res=>{
            axios.get("/api/rest/market-admin/?marketId="+this.state.query_marketId)
            .then(res=>{
            let data=res.data.content,
                totalElements=res.data.totalElements,
                totalPages=res.data.totalPages;

            this.setState({
                data_market_admin:data,
                totalElements,
                totalPages,
                visible:false,
                treeValue:"",
                update_name:""
            })
            message.success("编辑成功")
        })
        })
    
    
  }
  onChangeTree=(e)=>{
    this.setState({
        treeValue:e
    })
    
  }
    render(){
        let treeData=[]
        {
            for(let i=0;i<this.state.treeData.length;i++){
                    treeData[i]={
                        title:this.state.treeData[i],
                        value:this.state.treeData[i],
                        key:this.state.treeData[i],
                    } 
            }
        }
       
        return  (
            <div id="page-wrapper">
                <div style={{background:"#ececec",padding:"30px",padding:"20px"}}>
                    <Card title="市场管理用户详情" border={false} style={{width:"100%",padding:"24 41"}}>
                        <div>
                            <span className="query">用户名称 ：</span>
                            <input type="text" className="form-control input" placeholder="请输入用户名称" value={this.state.find_name} onChange={e=>this.inputFind(e)}/>
                            <span className="query" style={{marginLeft:63}}>市场名称:</span>  
                                <Select showSearch 
                                        placeholder="请选择市场名称"
                                        optionFilterProp="children"
                                        style={{ width: 100 ,padding:"10px 0",width:250 }} 
                                        className="query"
                                        value={this.state.query_marketId}
                                        onChange={(e)=>this.handleChange(e)} 
                                        filterOption={(input,option)=>option.props.children.indexOf(input)>=0}>
                                    {
                                        this.state.data_market.map((value,index)=>{
                                            return(<Option value={value.uuid}>{value.name}</Option>)
                                        })
                                    }
                                    
                                    
                                </Select>
                            <span className="action">
                                <Button className="query-btn" type="primary" onClick={()=>this.doFind()}>查询</Button>
                                <Button className="query-btn" onClick={()=>this.doReset()}>重置</Button>
                            </span>
                        </div>
                        <div><Button  className="add-btn" onClick={()=>this.createMarket()}><i className="fa fa-plus "></i>添加市场管理员</Button></div>
                    </Card>
                </div>
                <div className="row">
                    <div className="col-md-12">
                    <Spin spinning={this.state.loading} >
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>用户账号</th>
                                    <th>用户名称</th>
                                    <th>所属市场</th>
                                    {/* <th>下属店铺管理员</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.data_market_admin.map((value,index)=>{
                                        return (
                                            <tr name={index.toString()}>
                                                <td>{value.realName}</td>
                                                <td>{value.username}</td>
                                                <td>{value.market.name}</td>
                                                <td><Button type="primary" className="btn" onClick={(e)=>{this.doUpdate(e)}}>编辑</Button>
                                                    <Popconfirm title="确认删除 ？" onConfirm={()=>{this.confirm()}} onCancel={()=>this.cancel()} okText="确认" cancelText="取消">
                                                         <Button type="danger" className="btn" onClick={(e)=>{this.doDelete(e)}}>删除</Button>
                                                    </Popconfirm>
                                                </td>
                                                <td>
                                                     <Button>
                                                         <Link to={'/info/user-market-admin/'+value.market.uuid}>点击查看所有下属商铺管理员</Link>
                                                     </Button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        </Spin>
                    </div>
                </div>
                <Modal
          visible={this.state.add_visible}
          title="添加市场管理员"
          onOk={this.add_handleOk}
          onCancel={this.add_handleCancel}
          footer={[
            <Button key="back" onClick={this.add_handleCancel}>取消</Button>,
            <Button key="submit" className="add_modal_btn" type="primary" loading={this.state.add_loading} onClick={this.add_handleOk}>
              确定
            </Button>,
          ]}
        >
         <div>
             <Row type="flex" className="add_modal" justify="start">
                 <Col span={4}  >用户名 :</Col>
                 <Col span={15}><Input type="text" name="update_username" value={this.state.update_username} onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             <Row type="flex" className="add_modal" justify="start" >
                 <Col span={4}   >密码 :</Col>
                 <Col span={15}><Input type="text"  name="update_pwd" value={this.state.update_pwd}  onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             <Row type="flex" className="add_modal" justify="start" >
                 <Col span={4}   >姓名 :</Col>
                 <Col span={15}><Input type="text"  name="update_name" value={this.state.update_name}  onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             <Row type="flex" className="add_modal" justify="start">
                 <Col span={4}  >市场名称 :</Col>
                 <Col span={15}>
                 <Select 
                    style={{ width: 298 }} 
                    showSearch 
                    placeholder="请选择市场名称"
                    optionFilterProp="children"
                    type="text"
                    name="update_marketId" 
                    value={this.state.update_marketId} 
                    filterOption={(input,option)=>option.props.children.indexOf(input)>=0}
                    onChange={(e)=>{this.handleUpdateSelect(e)}}>
                     {this.state.data_market.map((value,index)=>{
                         return (<Option value={value.uuid}>{value.name}</Option>)
                     })}
           
                 </Select>
                 </Col>
             </Row>
         </div>
        </Modal>



         <Modal
          visible={this.state.visible}
          title="编辑市场管理员"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" className="add_modal_btn" type="primary" loading={this.state.add_loading} onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
         <div>
            
             <Row type="flex" className="add_modal" justify="start" >
                 <Col span={4}   >姓名 :</Col>
                 <Col span={15}><Input type="text"  name="update_name" value={this.state.update_name}  onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             <Row type="flex" className="add_modal" justify="start" >
                 <Col span={4}   >身份 :</Col>
                 <Col span={15}><TreeSelect treeData={treeData} 
                                            value={this.state.treeValue}
                                            onChange={(e)=>this.onChangeTree(e)}
                                            treeCheckable="true"
                                            showCheckedStrategy="SHOW_PARENT"
                                            style={{width:300}} /></Col>
             </Row>
             
         </div>
        </Modal>
        <Pagination current={this.state.page_number} 
                                total={this.state.totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.changeNumber(pageNum)}}/>
            </div>
        )
    }
}