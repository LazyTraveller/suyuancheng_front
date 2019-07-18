
import React,{Component} from 'react'
import PageTitle from '../../../component/page'
import Pagination from 'rc-pagination';
import axios from 'axios'
import "antd/dist/antd.css";
import{Link} from 'react-router-dom'
import { Modal, Button,Popconfirm, message,Select,Card,Row,Col,Input,Spin} from 'antd';
import Alert from '../../../component/alert'
import '../index.css'
import 'rc-pagination/dist/rc-pagination.min.css'
import util from '../../../util/fun'
import fun from '../../../component/select'
import Add from '../../../component/add/add_market.js'
const Option = Select.Option;
export default class DataStore extends Component{
    constructor(props){
        super(props);
        this.state={
            data_store:[],//获取到的数据dawdawd
            page_number:1,
            totalElements:1,
            totalPages:1,//数据页面
            find_name:"",
            find_pagination:false,
            find_page_number:0,
            find_totalElements:1,
            visible:false,//编辑显示框控制
            update_name:"",
            update_uuid:"",
            update_remark:"",
            update_marketId:"",
            update_no:"",
            delete_uuid:"",//删除的数据的key 
            delete_no_find:"",
            params:'',
            add_store:false,
            add_visible:false,
            selectQuery:"name",
            data_market:[],
            market_totalPages:1,
            market_pageNumber:1,
            update_market_totalPages:1,
            update_market_pageNumber:1,
            market_totalElements:1,
            add_store_select:"",
            update_store_select:"",
            update_Select_store:"",
            query_marketId:"",
            select_market_item:"",
            role:"",
            uuid:"",
            loading:true
            }
    }
    componentDidMount(){
        axios.get('/api/rest/user/user-info')
        .then(res=>{
            if(res.status==200){
                
            }else{
                this.props.history.push('/login')
            }
           this.setState({
               role:fun.select(res.data.roles)
           },()=>{
               if(this.state.role==="MARKET_MANAGER"){
                this.setState({
                    uuid:res.data.market.uuid,
                    loading:false
                })
                   axios.get('/api/rest/store/?marketId='+res.data.market.uuid)
                   .then(res=>{
                       
                       
                       this.setState({
                           data_store:res.data.content,
                           page_number:res.data.pageNumber+1,
                           totalElements:res.data.totalElements,
                       })
                   })
                    
               }else{
                axios.get('/api/rest/market/list')
                .then(res=>{
                    let market_totalElements=res.data.totalElements,
                        market_totalPages=res.data.totalPages;
                        this.setState({
                          data_market:res.data,
                          market_totalElements,
                          market_totalPages,
                          query_marketId:res.data[0].uuid,
                          loading:false
                    })
                    axios.get('/api/rest/store/?marketId='+res.data[0].uuid)
                    .then(res=>{
                        this.setState({
                            data_store:res.data.content,
                        //    page_number:res.data.pageNumber,
                           totalElements:res.data.totalElements,
                            loading:false
                        })
                        
                    })
                })
               }
           })
        },()=>{
                       
            this.props.history.push('/login')
        }
        )
    }

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
            let name=this.state.find_name||""
            axios.get('/api/rest/store/?page='+(pageNum-1)+"&name="+name+"&marketId="+this.state.query_marketId)
            .then(res=>{
                let data=res.data.content;
                
                
                this.setState({
                    data_store:data,
                    page_number:res.data.number+1,
                    totalElements:res.data.totalElements
                })
            })
        })}
        find_changeNumber(pageNum){
            let value=this.state.find_name;
            this.setState({
                find_page_number:pageNum,
            },()=>{
                axios.get('/api/rest/store/?page='+(pageNum-1)+'&'+this.state.selectQuery+'='+value)
                .then(res=>{
                    let data=res.data.content;
                    this.setState({
                        data_store:data
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
        if(value.length>0 && this.state.query_marketId){
            axios.get('/api/rest/store/?name'+"="+value+"&marketId="+this.state.query_marketId)
            .then(res=>{
            let data=res.data.content;
            let find_page_number=res.data.pageable.pageNumber+1
            let find_totalElements=res.data.totalElements
            let find_totalPages=res.data.totalPages
            this.setState({
                data_store:data,
                page_number:find_page_number,
                totalElements:find_totalElements,
                // find_pagination:true
            })
        })
        }
        else if(value.length<=0 && this.state.query_marketId!=""){
            axios.get("/api/rest/store/?marketId="+this.state.query_marketId)
            .then(res=>{
            let data=res.data.content;
            let find_page_number=res.data.pageable.pageNumber+1
            let find_totalElements=res.data.totalElements
            let find_totalPages=res.data.totalPages
            this.setState({
                data_store:data,
                page_number:find_page_number,
                totalElements:find_totalElements,
            })
        })
        }
        else if(this.state.query_marketId==""&&value.length>0){
            axios.get("/api/rest/store/?name="+value)
            .then(res=>{
            let data=res.data.content;
            let find_page_number=res.data.pageable.pageNumber+1
            let find_totalElements=res.data.totalElements
            let find_totalPages=res.data.totalPages
            this.setState({
                data_store:data,
                page_number:find_page_number,
                totalElements:find_totalElements,
            })
        })
        }else{
            axios.get("/api/rest/store/")
            .then(res=>{
            let data=res.data.content;
            let find_page_number=res.data.pageable.pageNumber+1
            let find_totalElements=res.data.totalElements
            let find_totalPages=res.data.totalPages
            this.setState({
                data_store:data,
                page_number:find_page_number,
                totalElements:find_totalElements,
            })
        })
        }
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
        let uuid=this.state.data_store[no].uuid
        let name=value.childNodes[0].innerText;
        
        let marketId=this.state.data_store[no].market.uuid;
        
        // let marketId=value.childNodes[1].innerText;
        let remark=value.childNodes[2].innerText;
        this.setState({
            visible: true,
            update_name:name,
            update_address:marketId,
            update_uuid:uuid,
            update_remark:remark,
            update_no:no,
            update_Select_store:marketId,
            find_pagination:false,
            update_store_select:uuid
          });
          axios.get('/api/rest/market/')
          .then(res=>{
              let market_totalElements=res.data.totalElements,
                  market_totalPages=res.data.totalPages;
                  this.setState({
                    data_market:res.data.content,
                    market_totalElements,
                    market_totalPages,
              })
          })
    }
    update_Select_store=(e)=>{
        this.setState({
            update_Select_store:e
        })
    }
    //编辑框弹出框点击成功回调
    handleOk = (e) => {
        let data=this.state.data_store[this.state.update_no];
       
            let readyData={
                marketId:data.market.uuid,
                name:this.state.update_name,
                remark:this.state.update_remark
            }
            axios.put('/api/rest/store/'+data.uuid,readyData)
            .then(res=>{
                message.success('编辑成功')
                this.setState({
                    visible:false,
                    update_name:data.name,
                    update_marketId:data.marketId,
                    update_remark:data.remark,
                },()=>{
                    axios.get('/api/rest/store/?marketId='+data.market.uuid+"&name="+this.state.find_name)
                    .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            update_Select_store:"",
                            update_address:"",
                            update_name:"",
                            update_marketId:"",
                            update_remark:"",
                            data_store:data,
                            page_number,
                            totalElements,
                            totalPages,
                            update_store_select:"",
                            update_market_pageNumber:1
                        })
                    })
                })},err=>{
                message.error("编辑失败")
            }) 
        }
      //编辑框弹出框失败回调
      handleCancel = (e) => {
        this.setState({
          visible: false,
          update_market_pageNumber:1,
          update_name:"",
          update_remark:"",
          update_address:""
        });
      }







    //删除按钮
    doDelete(e){
        let value=e.target.parentNode.parentNode;
        let name=value.getAttribute("name");
       
        let uuid=this.state.data_store[name].uuid
        let delete_market=this.state.data_store[name].market.uuid
        this.setState({
            delete_no:name,
            delete_market,
            delete_uuid:uuid,
        })  
    }
    //删除框确认时候回调
    confirm=(e)=>{
        let name=this.state.find_name
        axios.delete('/api/rest/store/'+this.state.delete_uuid)
        .then(res=>{
            if(this.state.role=="MARKET_MANAGER"){
                if(this.state.find_pagination){
                    axios.get('/api/rest/store/?page='+(this.state.find_page_number-1)+'&'+this.state.selectQuery+'='+this.state.find_name+"&name="+name)
                    .then(res=>{
                        message.success("删除成功")
                        let data=res.data.content;
                        let find_page_number=res.data.pageable.pageNumber+1
                        let find_totalElements=res.data.totalElements
                        let find_totalPages=res.data.totalPages
                        this.setState({
                            data_store:data,
                            find_page_number,
                            find_totalElements,
                            find_totalPages
                        })
                    })
                }else{
                    this.state.data_store.length--;
                    if(this.state.data_store.length<=0){
                        this.setState({
                            page_number:this.state.page_number-1
                        },()=>{
                            axios.get('/api/rest/store/?page='+(this.state.page_number-1)+'&size=10'+"&name="+name)
                            .then(res=>{
                                message.success("删除成功")
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
                            
                    }else{
                        axios.get('/api/rest/store/?page='+(this.state.page_number-1)+'&size=10'+"&name="+name)
                        .then(res=>{
                            message.success("删除成功")
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
                        }
                }
            }else{
                axios.get('/api/rest/store/?marketId='+this.state.query_marketId+"&name="+name)
                        .then(res=>{
                            message.success("删除成功")
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
                    // if(this.state.data_store.length<=0){
                    //     this.setState({
                    //         page_number:this.state.page_number-1
                    //     },()=>{
                    //         axios.get('/api/rest/store/?page='+(this.state.page_number-1)+'&size=10'+"&marketId="+this.state.select)
                    //         .then(res=>{
                    //             message.success("删除成功")
                    //             let data=res.data.content;
                    //             let page_number=res.data.pageable.pageNumber+1
                    //             let totalElements=res.data.totalElements
                    //             let totalPages=res.data.totalPages
                    //             this.setState({
                    //                 data_store:data,
                    //                 page_number,
                    //                 totalElements,
                    //                 totalPages
                    //             })
                    //         })
                    //     })
                            
                    // }else{
                    //     axios.get('/api/rest/store/?page='+(this.state.page_number-1)+'&size=10'+"&marketId="+this.state.delete_market)
                    //     .then(res=>{
                    //         message.success("删除成功")
                    //         let data=res.data.content;
                    //         let page_number=res.data.pageable.pageNumber+1
                    //         let totalElements=res.data.totalElements
                    //         let totalPages=res.data.totalPages
                    //         this.setState({
                    //             data_store:data,
                    //             page_number,
                    //             totalElements,
                    //             totalPages
                    //         })
                    //     })}
            }
            
           
        },err=>{
            message.error("删除失败，请确认产品和溯源秤是否清空")
        },()=>{
            message.error("删除失败，请确认产品和溯源秤是否清空")      
        })
      }
      //删除框取消时候回调
      cancel=(e)=>{
        
      }



  
    addTrue(){
        this.setState({
            addTrue:true
        },()=>{
            axios.get('/api/rest/store/?page=0&size=10')
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber;
                this.setState({
                    data_store:data
                })
            })
        })
    }
    handleChange(value) {
        this.setState({
            query_marketId:value
        })
      }

      createMarket=()=>{ 
        //   axios.get('/api/rest/store/list?marketId='+this.state.uuid)
        //   .then(res=>{
        //       let market_totalElements=res.data.totalElements,
        //           market_totalPages=res.data.totalPages;
        //           this.setState({
        //             data_market:res.data,
        //             add_visible:true
        //       })
        //   })
        this.setState({
            add_visible:true
        })
      }
      doReset=()=>{
        axios.get('/api/rest/store/?marketId='+this.state.query_marketId)
        .then(res=>{
            let data=res.data.content;
            let page_number=res.data.pageable.pageNumber+1
            let totalElements=res.data.totalElements
            let totalPages=res.data.totalPages
            this.setState({
                data_store:data,
                page_number,
                totalElements,
                totalPages,
                find_name:""
            })
        })
      }
      add_Select=(e)=>{
          this.setState({
            query_marketId:e
          })
      }
      update_Select=(e)=>{
          this.setState({
              update_store_select:e
          })
      }
      update_store_pagination=e=>{
        axios.get('/api/rest/market/?page='+(e-1))
        .then(res=>{
          let update_market_totalElements=res.data.totalElements,
              update_market_totalPages=res.data.totalPages;
              this.setState({
                data_market:res.data.content,
                update_market_totalElements,
                update_market_totalPages,
                update_market_pageNumber:e
          })
      })
      }
      add_store_pagination=e=>{
          axios.get('/api/rest/market/?page='+(e-1))
          .then(res=>{
            let market_totalElements=res.data.totalElements,
                market_totalPages=res.data.totalPages;
                this.setState({
                  data_market:res.data.content,
                  market_totalElements,
                  market_totalPages,
                  add_visible:true,
                  market_pageNumber:e
            })
        })
      }
      add_handleOk=()=>{
          let marketId=this.state.query_marketId,
            name=this.state.update_address,
            remark=this.state.update_remark;
            if(this.state.role==="MARKET_MANAGER"){
                marketId=this.state.uuid
            }else if(this.state.role=="ADMINISTRATOR"){
                
            }
            let readyData={
                name,
                remark,
                marketId
            }
            let header={
                headers:{
                    'Content-Type':'Application/json;charset=utf-8'
                }
            }
          axios.post('/api/rest/store/',readyData,header)
          .then(res=>{
              if(this.state.role=="MARKET_MANAGER"){
                axios.get(`/api/rest/store/?page=${(this.state.page_number-1)}&size=10&name=${this.state.find_name}`)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_store:data,
                        page_number,
                        totalElements,
                        totalPages,
                        update_address:" ",
                        update_remark:" ",
                        add_store_select:"",
                        market_pageNumber:1,
                    })
                })
              }else{
                axios.get(`/api/rest/store/?page=${(this.state.page_number-1)}&size=10&marketId=${this.state.query_marketId}&name=${this.state.find_name}`)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_store:data,
                        page_number,
                        totalElements,
                        totalPages,
                        update_address:" ",
                        update_remark:" ",
                        add_store_select:"",
                        market_pageNumber:1,
                    })
                })
              }
            
               this.setState({
                   add_visible:false
               },()=>{
                message.success("添加商铺成功")
               })   
              },(err)=>{
                message.error('添加商铺失败')
            }
          )
      }
      add_handleCancel=()=>{
          this.setState({
              add_visible:false,
              add_store_select:""
          })
      }
    render(){
        return (
            <div id="page-wrapper">
            <div style={{ background: '#ECECEC', padding: '30px' ,padding:"20px" }}>
                    <Card title="商铺详情" bordered={false} style={{ width: "100%"}} >
                    <span className="query">商铺名称:</span> 
                    <input type="text" class="form-control input" placeholder="请输入商铺名称" value={this.state.find_name } onChange={e=>this.inputFind(e)} onKeyDown={e=> this.inputFinds(e) }/>
                    {
                        this.state.role==="ADMINISTRATOR"?<span>
                            <span className="query" style={{marginLeft:63}}>市场名称:</span>  
                            <Select value={this.state.query_marketId} 
                                    showSearch
                                    placeholder="请选择市场名称" 
                                    filterOption={(input,option)=>option.props.children.indexOf(input)>=0}
                                    style={{ width: 100 ,padding:"10px 0",width:250 }} 
                                    className="query" 
                                    onChange={this.handleChange.bind(this)} >
                                {
                                    this.state.data_market.map((value,index)=>{
                                        return(<Option value={value.uuid}>{value.name}</Option>)
                                    })
                                }
                            </Select>
                            <Spin spinning={this.state.loading} />
                        </span>:null
                    }
                        
                    <span className="action">
                        <Button className="query-btn" type="primary" onClick={()=>this.doFind()}>查询</Button>
                        <Button className="query-btn" onClick={()=>this.doReset()}>重置</Button>
                    </span>
                    <div><Button   className="add-btn" onClick={()=>this.createMarket()}><i className="fa fa-plus "></i>添加商铺</Button></div>
                    </Card>
                </div>
                <div className="row">
                    <div className="col-md-12">
                    <Spin spinning={this.state.loading} >
                        <table className="table table-striped">   
                            <thead>
                                <tr>
                                    <th>商铺名称</th>
                                    <th>所属市场</th>
                                    <th>备注</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data_store.map((value,index)=>{
                                        return (
                                            <tr name={index.toString()} key={index}>
                                                <td>{value.name}</td>
                                                <td>{value.market.name}</td>
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
                    </div>
                </div>
                <Pagination     current={this.state.page_number} 
                                total={this.state.totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.changeNumber(pageNum)}}/>

        <div>
        <Modal
          visible={this.state.add_visible}
          title="添加商铺"
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
         <Row type="flex" className="add_modal" justify="start" >
                 <Col span={4}   >商铺名称 :</Col>
                 <Col span={15}><Input type="text"  name="update_address" value={this.state.update_address}  onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             {
                 this.state.role==="MARKET_MANAGER"?null:

                 <Row type="flex" className="add_modal" justify="start">
                 <Col span={4}  >市场名称 :</Col>
                 <Col span={1}>
                    <Select  showSearch 
                            optionFilterProp="children"
                            placeholder="请选择市场"
                            style={{ width: 296 }} 
                            value={this.state.query_marketId}
                            onChange={(e)=>{this.add_Select(e)}}
                            filterOption={(input,option)=>
                                option.props.children.indexOf(input)>=0
                            }>
                        {
                            this.state.data_market.map((value,index)=>{
                            return (
                                <Option value={value.uuid} key={index}>{value.name}</Option>
                            )
                        })
                        } 
                    </Select>                    
                </Col>
             </Row>
             }
            
             
             <Row type="flex" className="add_modal" justify="start" >
                 <Col span={4}   >备注 :</Col>
                 <Col span={15}><Input type="text" name="update_remark" value={this.state.update_remark} onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
         </div>
        </Modal>
        <Modal
          visible={this.state.visible}
          title="编辑商铺"
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
                 <Col span={4}  >店铺名称 :</Col>
                 <Col span={15}><Input type="text" name="update_name" value={this.state.update_name} onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             {/* <Row type="flex" className="add_modal" justify="start">
                 <Col span={4}  >市场名称 :</Col>
                 <Col span={15}>
                    <Select value={this.state.update_Select_store} style={{ width: 120 }} onChange={(e)=>{this.update_Select_store(e)}}>
                        {
                            this.state.data_market.map((value,index)=>{
                            return (
                                <Option value={value.uuid} key={index}>{value.name}</Option>
                            )
                        })
                        } 
                    </Select>
                    <Pagination current={this.state.update_market_pageNumber} total={this.state.market_totalElements} onChange={(e)=>{this.update_store_pagination(e)}}style={{marginTop:15}}/>
                    
                </Col>
             </Row> */}
             <Row type="flex" className="add_modal"  >
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