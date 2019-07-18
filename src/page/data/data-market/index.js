
import React,{Component} from 'react'
import PageTitle from '../../../component/page'
import Pagination from 'rc-pagination';
import axios from 'axios'
import "antd/dist/antd.css";
import { Modal, Button,Popconfirm, message,Select,Card,Input,Row, Col,Spin } from 'antd';
import Alert from '../../../component/alert'
import '../index.css'
import 'rc-pagination/dist/rc-pagination.min.css'
import util from '../../../util/fun'
import Add from '../../../component/add/add_market.js'
const Option = Select.Option;
let header={
    headers:{
        'Content-Type':"Application/json;charset=utf-8"
    }
}
export default class DataMarket extends Component{
    constructor(props){
        super(props);
        this.state={
            data_market:[],//获取到的数据dawdawd
            page_number:0,
            totalElements:1,
            totalPages:1,//数据页面
            find_name:"",
            // find_pagination:false,
            // find_page_number:0,
            // find_totalElements:1,
            visible:false,//编辑显示框控制
            update_name:"",
            update_uuid:"",
            update_remark:"",
            update_address:"",
            update_no:"",
            delete_uuid:"",//删除的数据的key 
            delete_no_find:"",
            params:'',
            add_visible:false,
            selectQuery:"name",
            add_true:false, 
            add_loading:false   
            }
    }
    componentDidMount(){
        axios.get('/api/rest/market/?page=0&size=10')
        .then(res=>{
            if(res.status==200){
                
            }else{
                this.props.history.push('/login')
            }
            
           
            let data=res.data.content;
            let page_number=res.data.pageable.pageNumber+1
            let totalElements=res.data.totalElements
            let totalPages=res.data.totalPages
            this.setState({
                data_market:data,
                page_number,
                totalElements,
                totalPages,
                loading:false
            })
        },()=>{
            
            
            this.props.history.push('/login')
        })
    }
    // componentDidUpdate(){   
    //     axios.get('/api/rest/market/?page=0&size=10')
    //     .then(res=>{
    //         let data=res.data.content;
    //         let page_number=res.data.pageable.pageNumber;
    //         this.setState({
    //             data_market:data
    //         })
    //     })
    // }

      //编辑框input框数据更新
      handleUpdate=(e)=>{
        let name=e.target.name;
        let value=e.target.value;
        this.setState({
            [name]:value
        })
      }
    //分页导航
    changeNumber(pageNum){
        this.setState({
            page_number:pageNum,
        },()=>{
            axios.get('/api/rest/market/?page='+(pageNum-1)+"&name="+this.state.find_name)
            .then(res=>{
                let data=res.data.content;
                this.setState({
                    data_market:data
                })
            })
        })}
        find_changeNumber(pageNum){
            let value=this.state.find_name;
            this.setState({
                find_page_number:pageNum,
            },()=>{
                axios.get('/api/rest/market/?page='+(pageNum-1)+'&'+this.state.selectQuery+'='+value)
                .then(res=>{
                    let data=res.data.content;
                    this.setState({
                        data_market:data
                    })
                })
            })}
    inputFind(e){
        this.setState({
            find_name:e.target.value
        })
    }
    //搜索功能
    doFind(){
        let value=this.state.find_name;
        axios.get('/api/rest/market/?'+this.state.selectQuery+"="+value)
        .then(res=>{
            let data=res.data.content;
            let find_page_number=res.data.pageable.pageNumber+1
            let find_totalElements=res.data.totalElements
            let find_totalPages=res.data.totalPages
           
            this.setState({
                data_market:data,
                page_number:find_page_number,
                totalElements:find_totalElements,
            })
        })
    }//搜索功能
    inputFinds(e){
        if(e.keyCode=='13'){
            this.doFind()
        }
    }




    //编辑更新数据
    doUpdate(e){
        let value=e.target.parentNode.parentNode;
        let no=value.getAttribute("name");
        let uuid=this.state.data_market[no].uuid
        let name=value.childNodes[0].innerText;
        let address=value.childNodes[1].innerText;
        let remark=value.childNodes[2].innerText;
        this.setState({
            visible: true,
            update_name:name,
            update_address:address,
            update_uuid:uuid,
            update_remark:remark,
            update_no:no,
            find_pagination:false
          });
    }
    //编辑框弹出框点击成功回调
    handleOk = (e) => {
        let data=this.state.data_market[this.state.update_no];
       
        
            let readyData={
                address:this.state.update_address,
                name:this.state.update_name,
                remark:this.state.update_remark
            }
            axios.put('/api/rest/market/'+data.uuid,readyData)
            .then(res=>{
                this.setState({
                    update_name:data.name,
                    update_address:data.address,
                    update_remark:data.remark,
                })
                let {address,name,remark}=res.data;
                data.address=address;
                data.name=name;
                data.remark=remark;
                message.success('编辑成功');
                this.setState({
                    visible: false,
                    update_name:"",
                    update_address:"",
                    update_remark:"",
                    find_pagination:false
                  });    
            },err=>{
                message.error("更新失败，请重试")
            }) 
        }
      //编辑框弹出框失败回调
      handleCancel = (e) => {
        this.setState({
          visible: false,
          update_name:"",
         update_address:"",
         update_remark:"",
        });
      }







    //删除按钮
    doDelete(e){
        let value=e.target.parentNode.parentNode;
        let name=value.getAttribute("name");
        let uuid=this.state.data_market[name].uuid;
        this.setState({
            delete_no:name,
            delete_uuid:uuid,
            // find_pagination:false
        })  
    }
    //删除框确认时候回调
    confirm=(e)=>{
        let name=this.state.find_name
        axios.delete('/api/rest/market/'+this.state.delete_uuid)
        .then(res=>{
            message.success("删除成功")
            if(this.state.find_pagination){
                axios.get('/api/rest/market/?page=0&size=10&name='+name)
                .then(res=>{
                    let data=res.data.content;
                    let find_page_number=res.data.pageable.pageNumber+1
                    let find_totalElements=res.data.totalElements
                    let find_totalPages=res.data.totalPages
                    this.setState({
                        data_market:data,
                        find_page_number,
                        find_totalElements,
                        find_totalPages
                    })
                })
            }else{
                this.state.data_market.length--;
                if(this.state.data_market.length<=0){
                    this.setState({
                        page_number:this.state.page_number-1
                    },()=>{
                        axios.get('/api/rest/market/?page='+(this.state.page_number-1)+'&size=10'+'&name='+name)
                        .then(res=>{
                            
                            let data=res.data.content;
                            let page_number=res.data.pageable.pageNumber+1
                            let totalElements=res.data.totalElements
                            let totalPages=res.data.totalPages
                            this.setState({
                                data_market:data,
                                page_number,
                                totalElements,
                                totalPages
                            })
                        })
                    })     
                }else{
                    axios.get('/api/rest/market/?page='+(this.state.page_number-1)+'&size=10'+'&name='+name)
                    .then(res=>{
                        
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_market:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                    })
                    }
            }
           
        },err=>{
            message.error("删除失败，请确认商铺是否清空")
        })
        
        
      }
      //删除框取消时候回调
      cancel=(e)=>{
        // message.error('取消删除');
      }



    createMarket(){
        this.setState({
            add_visible:true
        })
    }
    createMarketChangeVisible(){
        this.setState({
            add_visible:false,
            find_pagination:false
        },()=>{
            axios.get('/api/rest/market/?page=0&size=10')
           .then(res=>{
               let data=res.data.content;
               let page_number=res.data.pageable.pageNumber+1
               let totalElements=res.data.totalElements
               let totalPages=res.data.totalPages
               this.setState({
                   data_store:data,
                   page_number,
                   totalElements,
                   totalPages
               })
           })
       })
    }
    addTrue(){
        this.setState({
            addTrue:true
        },()=>{
            axios.get('/api/rest/market/?page=0&size=10')
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber;
                this.setState({
                    data_market:data
                })
            })
        })
    }
    handleChange(value) {
        this.setState({
            selectQuery:value
        })
      }
      doReset=()=>{
          this.setState({
              
          })
          axios.get('/api/rest/market/?page=0&size=10')
            .then(res=>{
            let data=res.data.content;
            let page_number=res.data.pageable.pageNumber+1
            let totalElements=res.data.totalElements
            let totalPages=res.data.totalPages
            this.setState({
                find_name:"",
                data_market:data,
                page_number,
                totalElements,
                totalPages
            })
        })
      }
      add_handleOk=()=>{
              this.setState({
                  add_loading:true
              })
              let readyData={
                  name:this.state.update_name,
                  address:this.state.update_address,
                  remark:this.state.update_remark
              }
              if(!readyData.name||!readyData.remark||!readyData.address){
                
                return 
            }
              axios.post('/api/rest/market/',readyData,{headers:{
                    'Content-Type':'application/json;charset=utf-8'
                }})
              .then(res=>{
                    this.setState({
                    add_loading:false,
                    add_visible:false,
                    update_name:" ",
                    update_address:" ",
                    update_remark:" "
                })
                  message.success("市场添加成功")
                  axios.get('/api/rest/market/?page='+(this.state.page_number-1)+'&size=10&name='+this.state.find_name)
                    .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_market:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                    })
              })
          }
          add_handleCancel=()=>{
              this.setState({
                  add_visible:false,
                  update_address:"",
                  update_name:"",
                  update_remark:""
              })
          }
      

    render(){
        return (
            <div id="page-wrapper">
                <div style={{ background: '#ECECEC', padding: '30px' ,padding:"20px" }}>
                    <Card title="市场详情" bordered={false} style={{ width: "100%" ,padding:"24 11"}} >
                    <div>
                        <span className="query">市场名称:</span> 
                        <input type="text" class="form-control input" placeholder="请输入市场名称" value={this.state.find_name } onChange={e=>this.inputFind(e)} onKeyDown={e=> this.inputFinds(e) }/>  
                            {/* <span className="query" style={{marginLeft:63}}>查询条件:</span>  
                            <Select defaultValue={this.state.selectQuery} style={{ width: 100 ,padding:"10px 0",width:250 }} className="query" onChange={this.handleChange.bind(this)} >
                                
                                <Option value="name">市场名称</Option>
                                
                            </Select> */}
                        <span className="action">
                            <Button className="query-btn" type="primary" onClick={()=>this.doFind()}>查询</Button>
                            <Button className="query-btn" onClick={()=>this.doReset()}>重置</Button>
                        </span>
                    </div>
                    <div><Button  className="add-btn" onClick={()=>this.createMarket()}><i className="fa fa-plus "></i>添加市场</Button></div>
                    </Card>
                </div>  
                <div class="form-group">
            
            </div>
                <div className="row">
                    <div className="col-md-12" style={{float:"left"}}>
                        
                    <Spin spinning={this.state.loading} >
                        <table className="table table-striped" >   
                            <thead>
                                <tr>
                                    {/* <th>编号</th> */}
                                    <th >市场名称</th>
                                    <th>市场地址</th>
                                    <th>备注</th>
                                    {/* <th>操作</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data_market.map((value,index)=>{
                                        return (
                                            <tr name={index.toString()}>
                                                {/* <td>{value.uuid}</td> */}
                                                <td>{value.name}</td>
                                                <td>{value.address}</td>
                                                <td>{value.remark}</td>
                                                <td><Button type="primary" className="btn" onClick={(e)=>{this.doUpdate(e)}}>编辑</Button>
                                                    <Popconfirm title="确认删除 ？" onConfirm={this.confirm} onCancel={this.cancel} okText="确认" cancelText="取消">
                                                         <Button type="danger" className="btn" onClick={(e)=>{this.doDelete(e)}}>删除</Button>
                                                    </Popconfirm>
                                                </td>
                                            </tr> 
                                        )
                                    })
                                }
                                
                                
                            </tbody>
                            
                        </table> 
                        </Spin>
                 
                    
                    <Pagination current={this.state.page_number} 
                                total={this.state.totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.changeNumber(pageNum)}}/>
           
                    </div>
                </div>
               

        <div>
        <Modal
          visible={this.state.visible}
          title="编辑市场"
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
             <Row type="flex" className="add_modal" >
                 <Col span={4}  >市场名称 :</Col>
                 <Col span={15}><Input type="text" name="update_name" value={this.state.update_name} onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             <Row type="flex" className="add_modal"  >
                 <Col span={4}   >市场地址 :</Col>
                 <Col span={15}><Input type="text"  name="update_address" value={this.state.update_address} onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             <Row type="flex" className="add_modal"  >
                 <Col span={4}   >备注 :</Col>
                 <Col span={15}><Input type="text" name="update_remark" value={this.state.update_remark} onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
         </div>
        </Modal>



        <Modal
          visible={this.state.add_visible}
          title="添加市场"
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
                 <Col span={4}  >市场名称 :</Col>
                 <Col span={15}><Input type="text" name="update_name" value={this.state.update_name} onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             <Row type="flex" className="add_modal" justify="start" >
                 <Col span={4}   >市场地址 :</Col>
                 <Col span={15}><Input type="text"  name="update_address" value={this.state.update_address}  onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             <Row type="flex" className="add_modal" justify="start" >
                 <Col span={4}   >备注 :</Col>
                 <Col span={15}><Input type="text" name="update_remark" value={this.state.update_remark} onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
         </div>
        </Modal>
        </div>
            </div>
        )
    }
}