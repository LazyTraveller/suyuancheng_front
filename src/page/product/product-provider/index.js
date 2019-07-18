
import React,{Component} from 'react'
import PageTitle from '../../../component/page'
import Pagination from 'rc-pagination';
import axios from 'axios'
import "antd/dist/antd.css";
import{Link} from 'react-router-dom'
import { Modal, Button,Popconfirm, message,Select ,Card,Col,Row,Input,Spin} from 'antd';
import Alert from '../../../component/alert'
import '../index.css'
import fun from '../../../component/select'
import 'rc-pagination/dist/rc-pagination.min.css'
import util from '../../../util/fun'
import Add from '../../../component/add/add_market.js'
const Option = Select.Option;
export default class ProductProvider extends Component{
    constructor(props){
        super(props);
        this.state={
            data_provider:[],
            data_store:[],//获取到的数据dawdawd
            page_number:0,
            totalElements:1,
            totalPages:1,//数据页面
            find_name:"",
            find_pagination:false,
            find_page_number:0,
            find_totalElements:1,
            visible:false,//编辑显示框控制
            update_name:"",
            update_uuid:"",
            update_storeId:"",
            update_remark:"",
            update_address:"",
            update_no:"",
            delete_uuid:"",//删除的数据的key  
            delete_no_find:"",
            params:'',
            add_visible:false,
            selectQuery:"name",
            add_true:false,    
            select_market:[],
            select_store:[{uuid:""}],
            boolean:false,
            select_marketId:"",
            select_storeId:"",
            select_store_item:"",
            uuid:"",
            role:"",
            uuid_market:"",
            RESET:"",
            loading:true,
            update_provider_uuid:""
            }
    }
    componentWillMount(){
        
    //     axios.get('/api/rest/market/list')
    //     .then(res=>{
    //         this.setState({
    //             select_market:res.data,
    //             select_market_item:res.data[0].uuid
    //         },()=>{
    //             axios.get('/api/rest/store/list?marketId='+res.data[0].uuid)
    //             .then(res=>{
    //                 this.setState({
    //                     select_store:res.data,
    //                     select_store_item:res.data[0].uuid
    //                 },()=>{
    //                     axios.get('/api/rest/provider/?page=0&size=10&storeId='+this.state.select_store_item)
    //                     .then(res=>{
    //                         let data=res.data.content;
    //                         let page_number=res.data.pageable.pageNumber+1
    //                         let totalElements=res.data.totalElements
    //                         let totalPages=res.data.totalPages
    //                         this.setState({
    //                             data_provider:data,
    //                             page_number,
    //                             totalElements,
    //                             totalPages
    //                         })
    //                     })
    //                 })
    //         })
    //     })
    // })
        
    axios.get('/api/rest/user/user-info')
    .then(res=>{
        if(res.status!=200){
            this.props.history.push('/login')
        }
       this.setState({
           role:fun.select(res.data.roles)
       },()=>{
        if(fun.select(res.data.roles)=="STORE_MANAGER"){
            this.setState({
                uuid:res.data.store.uuid
            },()=>{
                axios.get(`/api/rest/provider/?storeId=${this.state.uuid}`)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_provider:data,
                        page_number,
                        totalElements,
                        totalPages,
                        add_visible:false,
                        update_name:" ",
                        update_remark:" ",
                        loading:false
                    
                })
            })
            })
            
       }else if(fun.select(res.data.roles)=="MARKET_MANAGER"){
           this.setState({
               uuid_market:res.data.market.uuid,
               select_store_item:res.data.market.uuid
           })
           axios.get('/api/rest/store/list?marketId='+res.data.market.uuid)
           .then(res=>{
            if(res.data.length<=0){
                this.setState({
                    loading:false
                })}else{
                    this.setState({
                        select_store:res.data,
                        select_store_item:res.data[0].uuid,
                        RESET:res.data[0].uuid,
                    })
                    axios.get('/api/rest/provider/?storeId='+res.data[0].uuid)
                    .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_provider:data,
                        page_number,
                        totalElements,
                        totalPages,
                        find_name:"",
                        select_store_item:this.state.select_store[0].uuid,
                        loading:false,
                    })
                })
                }
           
           })
           
       }
       else{
        axios.get('/api/rest/market/list')
        .then(res=>{
            this.setState({
                select_market:res.data,
                select_market_item:res.data[0].uuid
            },()=>{
                axios.get('/api/rest/store/list?marketId='+res.data[0].uuid)
                .then(res=>{
                    this.setState({
                        select_store:res.data,
                        loading:false
                    },()=>{
                        if(res.data.length<=0){

                        }else{
                            this.setState({
                                select_store_item:res.data[0].uuid,
                            },()=>{
                                axios.get('/api/rest/provider/?page=0&size=10&storeId='+this.state.select_store_item)
                                .then(res=>{
                                    
                                    let data=res.data.content;
                                    let page_number=res.data.pageable.pageNumber+1
                                    let totalElements=res.data.totalElements
                                    let totalPages=res.data.totalPages
                                    this.setState({
                                        data_provider:data,
                                        page_number,
                                        totalElements,
                                        loading:false,
                                        totalPages
                                    })
                                })
                            })
                        }
                     
                    })
            })
        })
    })
       }
       })
       
    },()=>{
        this.props.history.push('/login')
    })
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
        let name=this.state.find_name||""
        this.setState({
            page_number:pageNum,
        },()=>{
            axios.get('/api/rest/provider/?page='+(pageNum-1)+"&storeId="+this.state.select_store_item+"&name="+name)
            .then(res=>{
                
                this.setState({
                    data_provider:res.data.content,
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
                axios.get('/api/rest/provider/?page='+(pageNum-1)+'&'+this.state.selectQuery+'='+value)
                .then(res=>{
                    let data=res.data.content;
                    this.setState({
                        data_provider:data
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
        let storeId=this.state.select_store_item;
        if(storeId&&value){
            axios.get('/api/rest/provider/?'+this.state.selectQuery+"="+value+"&storeId="+storeId)
            .then(res=>{
               
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let find_page_number=res.data.pageable.pageNumber+1
                let find_totalElements=res.data.totalElements
                let find_totalPages=res.data.totalPages
                this.setState({
                    data_provider:data,
                    // find_page_number,
                    page_number,
                    totalElements:res.data.totalElements,
                    totalPages:res.data.totalPages
                    // find_totalElements,
                // find_pagination:true
            })
        })
        }else if(storeId&&!value){
            axios.get('/api/rest/provider/?storeId='+storeId)
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let find_page_number=res.data.pageable.pageNumber+1
                let find_totalElements=res.data.totalElements
                let find_totalPages=res.data.totalPages
                this.setState({
                    data_provider:data,
                    // find_page_number,
                    page_number,
                    totalElements:res.data.totalElements,
                    totalPages:res.data.totalPages
                    // find_totalElements,
                // find_pagination:true
            })
        })
        }else if(value&&!storeId){
            axios.get('/api/rest/provider/?name='+value)
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let find_totalElements=res.data.totalElements
                let find_totalPages=res.data.totalPages
                this.setState({
                    data_provider:data,
                    // find_page_number,
                    page_number,
                    // find_totalElements,
                    totalElements:res.data.totalElements,
                    totalPages:res.data.totalPages
                // find_pagination:true
            })
        })
        }else{
            return 
        }
        
    }

    //搜索功能
    inputFinds(e){
        if(e.keyCode=='13'){
            this.doFind()
        }
    }




    //编辑更新数据
    doUpdate(e){
        let value=e.target.parentNode.parentNode;
        let no=value.getAttribute("name");
        let uuid=this.state.data_provider[no];
        let update_provider_uuid=uuid.uuid;
        let name=value.childNodes[0].innerText;
        let remark=value.childNodes[2].innerText;
        if(this.state.role=="MARKET_MANAGER"){
            remark=value.childNodes[1].innerText;
        }
        
        this.setState({
            visible: true,
            update_name:name,
            update_uuid:uuid.uuid,
            update_remark:remark,
            update_no:no,
            update_provider_uuid
          });
    }
    //编辑框弹出框点击成功回调
    handleOk = (e) => {
        let data=this.state.data_provider[this.state.update_no];
        let providerUUid=this.state.update_provider_uuid
        let providerId=data.uuid;
            // let readyData={
            //     name:this.state.update_name,
            //     remark:this.state.update_remark,
            //     storeId,  
            // }
        let name=this.state.find_name||"";
            
            if(["MARKET_MANAGER","ADMINISTRATOR"].indexOf(this.state.role)>=0){
                let storeId=data.store.uuid
                let readyData={
                    name:this.state.update_name,
                    remark:this.state.update_remark,
                    storeId,  
                }
               
                axios.put('/api/rest/provider/'+providerId,readyData)
                .then(res=>{
                axios.get('/api/rest/provider/?storeId='+storeId+"&name="+name)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_provider:data,
                        page_number,
                        totalElements,
                        totalPages,
                        visible: false,
                        update_name:" ",
                        update_remark:" ",
                    })  
            }) 
        },(err)=>{
            message.error("编辑失败，请稍后操作")
        })}
            if(this.state.role=="STORE_MANAGER"){
                let storeId=data.uuid
                
                let readyData={
                    name:this.state.update_name,
                    remark:this.state.update_remark,
                    storeId,  
                }
                axios.put('/api/rest/provider/'+providerId,readyData)
            .then(res=>{
                axios.get('/api/rest/provider/?page=0&size=10'+"&name="+name)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_provider:data,
                        page_number,
                        totalElements,
                        totalPages,
                        visible: false,
                        update_name:" ",
                        update_remark:" ",
                    })  
            }) 
        },(err)=>{
            message.error("编辑失败，请稍后操作")
        })
            }


            if(this.state.role=="ADMINISTRATOR"){
                let storeId=data.uuid
                let readyData={
                    name:this.state.update_name,
                    remark:this.state.update_remark,
                    storeId,  
                }
                axios.put('/api/rest/provider/'+providerId,readyData)
            .then(res=>{
                axios.get('/api/rest/provider/?page=0&size=10'+"&name="+name)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_provider:data,
                        page_number,
                        totalElements,
                        totalPages,
                        visible: false,
                        update_name:" ",
                        update_remark:" ",
                    })  
            }) 
        },(err)=>{
            message.error("编辑失败，请稍后操作")
        })
            }
            
    }
      //编辑框弹出框失败回调
      handleCancel = (e) => {
        this.setState({
          visible: false,
          update_name:"",
          update_remark:""
        });
      }




      add_handleCancele=()=>{
          this.setState({
              add_visible:false
          })
      }


    //删除按钮
    doDelete(e){
        let value=e.target.parentNode.parentNode;
        let name=value.getAttribute("name");
        let uuid=this.state.data_provider[name].uuid
        this.setState({
            delete_no:name,
            delete_uuid:uuid,
            find_pagination:false
        })  
    }
    //删除框确认时候回调
    confirm=(e)=>{
        let name =this.state.find_name
         axios.delete('/api/rest/provider/'+this.state.delete_uuid)
        .then(res=>{
            if(this.state.role=="STORE_MANAGER"){
                this.state.data_provider.length--;
                if(this.state.data_provider.length<=0){
                    this.setState({
                        page_number:this.state.page_number-1
                    },()=>{
                        axios.get('/api/rest/provider/?page='+(this.state.page_number-1)+'&size=10'+"&name="+name)
                        .then(res=>{
                            message.success("删除成功")
                            let data=res.data.content;
                            let page_number=res.data.pageable.pageNumber+1
                            let totalElements=res.data.totalElements
                            let totalPages=res.data.totalPages
                            this.setState({
                                data_provider:data,
                                page_number,
                                totalElements,
                                totalPages
                            })
                        })
                    })
                        
                }else{
                    axios.get('/api/rest/provider/?page='+(this.state.page_number-1)+'&size=10'+"&name="+name)
                    .then(res=>{
                        message.success("删除成功")
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_provider:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                    })
                    }
            }else{
                this.state.data_provider.length--;
                if(this.state.data_provider.length<=0){
                    this.setState({
                        page_number:this.state.page_number-1
                    },()=>{
                        axios.get('/api/rest/provider/?storeId='+this.state.select_store_item+"&name="+name)
                        .then(res=>{
                            message.success("删除成功")
                            let data=res.data.content;
                            let page_number=res.data.pageable.pageNumber+1
                            let totalElements=res.data.totalElements
                            let totalPages=res.data.totalPages
                            this.setState({
                                data_provider:data,
                                page_number,
                                totalElements,
                                totalPages
                            })
                        })
                    })
                        
                }else{
                    axios.get('/api/rest/provider/?storeId='+this.state.select_store_item+"&name="+name)
                    .then(res=>{
                        message.success("删除成功")
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_provider:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                    })
                    }
            }
           
        },err=>{
           message.error('删除失败，请确认所供应产品是否清空')
        })
        
        
      }
      //删除框取消时候回调
      cancel=(e)=>{
        message.error('删除取消');
      }



    createprovider(){
        this.setState({
            add_visible:true
        })
    }
    createProviderChangeVisible(){
        this.setState({
            add_visible:false,
            find_pagination:false
        })
    }
    addTrue(){
        this.setState({
            addTrue:true
        },()=>{
            axios.get('/api/rest/provider/?page=0&size=10')
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber;
                this.setState({
                    data_provider:data
                })
            })
        })
    }
    handleChange(value) {
        this.setState({
            selectQuery:value
        })
      }
      createMarket=()=>{
            this.setState({
                add_visible:true,
            })
      }
      add_handleCancel=()=>{
        this.setState({
            add_visible:false
        })
    }
      add_handleOk=()=>{
          let name=this.state.update_name,
            remark=this.state.update_remark,
            storeId=this.state.select_store_item
            if(this.state.role=="STORE_MANAGER"){
                
                
                storeId=this.state.uuid
                
            }
          let readyData={
              name,
              remark,
              storeId
          }
          let header={
              headers:{
                  'Content-Type':'application/json;charset=utf-8'
              }
          }
          
          axios.post('/api/rest/provider/',readyData,header)
          .then(res=>{
              let name=this.state.find_name;
            axios.get(`/api/rest/provider/?storeId=${this.state.select_store_item}&name=${name}`)
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let totalElements=res.data.totalElements
                let totalPages=res.data.totalPages
                this.setState({
                    data_provider:data,
                    page_number,
                    totalElements,
                    totalPages,
                    add_visible:false,
                    update_name:" ",
                    update_remark:" ",
                },()=>{
                    message.success("添加成功")
                })
            })
              
          },()=>{
              message.error('添加失败')
          }) 
      }
      
      doReset=()=>{
          
          if(["ADMINISTRATOR","MARKET_MANAGER"].indexOf(this.state.role)>=0){
            axios.get('/api/rest/provider/?storeId='+this.state.select_store_item)
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let totalElements=res.data.totalElements
                let totalPages=res.data.totalPages
                this.setState({
                    data_provider:data,
                    page_number,
                    totalElements,
                    totalPages,
                    find_name:"",
                })
            })
          }else{
            axios.get('/api/rest/provider/?storeId='+this.state.RESET)
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let totalElements=res.data.totalElements
                let totalPages=res.data.totalPages
                this.setState({
                    data_provider:data,
                    page_number,
                    totalElements,
                    totalPages,
                    find_name:"",
                })
            })
          }
        
      }
      handleUpdateSelectMarket=(e)=>{
          this.setState({
              select_market_item:e
          })
          axios.get('/api/rest/store/list/?marketId='+e)
          .then(res=>{
              this.setState({
                  select_store:res.data,
              })
          }) 
      }
      handleUpdateSelectStore=(e)=>{
          this.setState({
              select_store_item:e
          })
      }

    render(){
        const role=this.state.role;
        return (
            <div id="page-wrapper" style={{paddingLeft:32}}>
            {/* <Spin spinning={this.state.loading}> */}
            <div style={{ background: '#ECECEC', padding: '30px' ,padding:"20px"}}>
                    <Card title="供货商详情" bordered={false} style={{ width: "100%"}} >
                    
                    <span className="query">供货商名称:</span> 
                    <input type="text" class="form-control input" placeholder="请输入供货商名称" style={{marginRight:5}}value={this.state.find_name } onChange={e=>this.inputFind(e)} onKeyDown={e=> this.inputFinds(e) }/>
                        {/* {this.state.role==="STORE_MANAGER"? null:
                            <span >
                            
                                {
                                    this.state.role==="ADMINISTRATOR"?<Select 
                                    style={{ width: 150}} 
                                    showSearch 
                                    placeholder="请选择市场名称"
                                    optionFilterProp="children"
                                    type="text"
                                    name="update_storeId" 
                                    value={this.state.select_market_item} 
                                    filterOption={(input,option)=>option.props.children.indexOf(input)>=0}
                                    onChange={(e)=>{this.handleUpdateSelectMarket(e)}}>
                                    {this.state.select_market.map((value,index)=>{
                                        return (<Option value={value.uuid}>{value.name}</Option>)
                                    })}
                                </Select>:null
                                
                                }
                                
                                {
                                    this.state.role==="Market_MANAGER"?<Select 
                                    style={{ width: 150 }} 
                                    showSearch 
                                    placeholder="请选择商铺名称"
                                    optionFilterProp="children"
                                    type="text"
                                    name="update_storeId" 
                                    value={this.state.select_store_item} 
                                    filterOption={(input,option)=>option.props.children.indexOf(input)>=0}
                                    onChange={(e)=>{this.handleUpdateSelectStore(e)}}>
                                    {this.state.select_store.map((value,index)=>{
                                        return (<Option value={value.uuid}>{value.name}</Option>)
                                    })}
                                   
                                </Select>:null
                                }
                                
                                <Spin spinning={this.state.loading} />
                            </span>
                        } */}
                        {
                                    this.state.role==="ADMINISTRATOR"?
                                    <span >
                                        <Select 
                                        style={{ width: 150}} 
                                        showSearch 
                                        placeholder="请选择市场名称"
                                        optionFilterProp="children"
                                        type="text"
                                        name="update_storeId" 
                                        value={this.state.select_market_item} 
                                        filterOption={(input,option)=>option.props.children.indexOf(input)>=0}
                                        onChange={(e)=>{this.handleUpdateSelectMarket(e)}}>
                                        {this.state.select_market.map((value,index)=>{
                                            return (<Option value={value.uuid}>{value.name}</Option>)
                                        })}
                                        </Select>
                                        <Select 
                                            style={{ width: 150 }} 
                                            showSearch 
                                            placeholder="请选择商铺名称"
                                            optionFilterProp="children"
                                            type="text"
                                            name="update_storeId" 
                                            value={this.state.select_store_item} 
                                            filterOption={(input,option)=>option.props.children.indexOf(input)>=0}
                                            onChange={(e)=>{this.handleUpdateSelectStore(e)}}>
                                            {this.state.select_store.map((value,index)=>{
                                                return (<Option value={value.uuid}>{value.name}</Option>)
                                            })}
                                        
                                        </Select>
                                        <Spin spinning={this.state.loading} />
                                    </span>:null
                                
                                }
                        {this.state.role==="MARKET_MANAGER"?   <span >
                                <Select 
                                    style={{ width: 150 }} 
                                    showSearch 
                                    placeholder="请选择商铺名称"
                                    optionFilterProp="children"
                                    type="text"
                                    name="update_storeId" 
                                    value={this.state.select_store_item} 
                                    filterOption={(input,option)=>option.props.children.indexOf(input)>=0}
                                    onChange={(e)=>{this.handleUpdateSelectStore(e)}}>
                                    {this.state.select_store.map((value,index)=>{
                                        return (<Option value={value.uuid}>{value.name}</Option>)
                                    })}
                                   
                                </Select>
                                <Spin spinning={this.state.loading} />
                            </span>:null
                          
                        }
                    <span className="action">
                        <Button className="query-btn" type="primary" onClick={()=>this.doFind()}>查询</Button>
                        <Button className="query-btn" onClick={()=>this.doReset()}>重置</Button>
                    </span>
                    <div>
                    
                        <Button type="primary" className="add-btn" onClick={()=>this.createMarket()}><i className="fa fa-plus "></i>添加供货商</Button></div>
                    </Card>
                </div>  
                <div className="row">
                    <div className="col-md-12">
                    <Spin spinning={this.state.loading} >
                        <table className="table table-striped" style={{MarginLeft:50}}>   
                       
                            <thead >
                                <tr>
                                
                                    <th>供货商名称</th>
                                    
                                    <th>商铺名称</th>
                                  
                                    <th>备注</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data_provider.map((value,index)=>{
                                        return (
                                            <tr name={index.toString()} key={index}>
                                                <td>{value.name}</td>
                                                <td>{value.store.name}</td>
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
              

                 <Pagination current={this.state.page_number} 
                                total={this.state.totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.changeNumber(pageNum)}}/>

        <div>
        <Modal
          title="编辑供应商"
          okText="确定"
          cancelText="取消"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            <div>
                <Row type='flex' className="add_modal" justify="start">
                    <Col span={5}> 供货商名称：</Col>
                    <Col span={15}><Input type="text" class="form-control input update" name="update_name" value={this.state.update_name} onChange={e=>{this.handleUpdate(e)}}/></Col>
                </Row>
                <Row type="flex" className="add_modal" justify="start">
                    <Col span={5}>备注：</Col>
                    <Col span={15}><Input type="text" class="form-control input update"  name="update_remark" value={this.state.update_remark} onChange={e=>{this.handleUpdate(e)}}/></Col>
                </Row>
            </div> 
        </Modal>
        <Modal
          visible={this.state.add_visible}
          title="添加供货商"
          onOk={()=>{this.add_handleOk()}}
          onCancel={()=>{this.add_handleCancel()}}
          footer={[
            <Button key="back" onClick={this.add_handleCancel}>取消</Button>,
            <Button key="submit" className="add_modal_btn" type="primary" loading={this.state.add_loading} onClick={this.add_handleOk}>
              确定
            </Button>,
          ]}
        >
         <div>
            <Row type="flex" className="add_modal" justify="start" >
                 <Col span={5}  >供货商名称 :</Col>
                 <Col span={15}><Input type="text" value={this.state.update_name} name="update_name"   onChange={(e)=>{this.handleUpdate(e)}}/></Col>
            </Row>
            

            {this.state.role!=="STORE_MANAGER"?
            <Row type="flex" className="add_modal" justify="start" >
                 <Col span={5}   >商铺名称 :</Col>
                 <Col span={15}>
                 {
                     this.state.role=="ADMINISTRATOR"?
                     <Select 
                        style={{ width: 147}} 
                        showSearch 
                        placeholder="请选择市场名称"
                        optionFilterProp="children"
                        type="text"
                        name="update_storeId" 
                        value={this.state.select_market_item} 
                        filterOption={(input,option)=>option.props.children.indexOf(input)>=0}
                        onChange={(e)=>{this.handleUpdateSelectMarket(e)}}>
                        {this.state.select_market.map((value,index)=>{
                            return (<Option value={value.uuid}>{value.name}</Option>)
                        }
                        )}
                    </Select>:null
                 }
                 

                    <Select 
                        style={{ width: 147 }} 
                        showSearch 
                        placeholder="请选择商铺名称"
                        optionFilterProp="children"
                        type="text"
                        name="update_storeId" 
                        value={this.state.select_store_item} 
                        filterOption={(input,option)=>option.props.children.indexOf(input)>=0}
                        onChange={(e)=>{this.handleUpdateSelectStore(e)}}>
                        {this.state.select_store.map((value,index)=>{
                            return (<Option value={value.uuid}>{value.name}</Option>)
                        })}
                    </Select>
                 </Col>
             </Row>:null}
            
             <Row type="flex" className="add_modal" justify="start" >
                 <Col span={5}   >备注 :</Col>
                 <Col span={15}><Input type="text" value={this.state.update_remark} name="update_remark"  onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
         </div>
        </Modal>
        </div>
        {/* </Spin> */}
            </div>
        )
    }
}