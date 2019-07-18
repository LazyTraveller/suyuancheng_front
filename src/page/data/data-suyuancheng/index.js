
import React,{Component} from 'react'
import PageTitle from '../../../component/page'
import Pagination from 'rc-pagination';
import axios from 'axios'
import "antd/dist/antd.css";
import{Link} from 'react-router-dom'
import { Modal, Button,Popconfirm, message,Select,Table,Card,Input,Col,Row,InputNumber,Spin } from 'antd';
import Alert from '../../../component/alert'
import '../index.css'
import 'rc-pagination/dist/rc-pagination.min.css'
import util from '../../../util/fun'
import Add from '../../../component/add/add_market.js'
import fun from '../../../component/select'
const Option = Select.Option;
  
export default class Goodssuyuancheng extends Component{
    constructor(props){
        super(props);
        this.state={
            data_suyuancheng:[],
            data_plu:[],
            store_list:[],//获取到的数据dawdawd
            page_number:0,
            totalElements:1,
            plu_page_number:0,
            plu_totalElements:1,
            find_name:"",
            selectQuery:"",
            find_pagination:false,
            find_page_number:0,
            find_totalElements:1,
            visible:false,//编辑显示框控制
            update_name:"",
            update_uuid:"",
            update_remark:"",
            update_marketId:"",
            update_no:0,
            delete_uuid:"",//删除的数据的key 
            delete_no_find:"",
            params:'',
            add_visible:false,
            add_true:false,
            show_plu_visible:false,
            add_plu_visible:false,
            data_store:[],
            add_Select_store:"",
            store_totalElements:1,
            store_totalPages:1,
            update_machineId:"",
            update_remark:"",
            add_store_select:"",
            data_goods:[],
            goods_totalElements:1,
            goods_totalPages:1,
            price:0,
            code:1,
            array:[],
            add_plu_number:20,
            update_Select_store:"",
            store_pageNumber:1,
            add_Select_store:"",
            add_select_store_pagination:1,
            add_Select_store:"",
            goods_pageNumber:1,
            role:"",
            uuid:"",
            loading:true,
            select_store:[{uuid:""}],
            select_store_item:"",
            select_market_item:"",
            select_market:[]
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
               if(this.state.role=="STORE_MANAGER"){
                   this.setState({
                    uuid:res.data.store.uuid,
                   },()=>{
                    axios.get('/api/rest/su-yuan-cheng/?page=0&size=10')
                    .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            
                            data_suyuancheng:data,
                            page_number,
                            totalElements,
                            totalPages,
                            loading:false
                        })
                    })
                   })
                   
               
               }else if(this.state.role=="MARKET_MANAGER"){
                this.setState({
                    uuid_market:res.data.market.uuid,
                    select_store_item:res.data.market.uuid
                })
                axios.get('/api/rest/store/list?marketId='+res.data.market.uuid)
                .then(res=>{
                    if(res.data.length<=0){
                        this.setState({
                            loading:false
                        })}
                        else{
                 this.setState({
                     select_store:res.data,
                     select_store_item:res.data[0].uuid,
                     RESET:res.data[0].uuid,
                 })
                 axios.get('/api/rest/su-yuan-cheng/?storeId='+res.data[0].uuid)
                 .then(res=>{
                 let data=res.data.content;
                 let page_number=res.data.pageable.pageNumber+1
                 let totalElements=res.data.totalElements
                 let totalPages=res.data.totalPages
                 this.setState({
                    data_suyuancheng:data,
                     page_number,
                     totalElements,
                     totalPages,
                     find_name:"",
                     loading:false,
                 })
             })}



                })
               }else{


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
                                        // axios.get('/api/rest/goods/?storeId='+res.data[0].uuid)
                                        // .then(res=>{
                                        //     let data=res.data.content;
                                        //     let page_number=res.data.pageable.pageNumber+1
                                        //     let totalElements=res.data.totalElements
                                        //     let totalPages=res.data.totalPages
                                        //     this.setState({
                                        //         data_goods:data,
                                        //         page_number,
                                        //         totalElements,
                                        //         loading:false,
                                        //         totalPages
                                        //     })
                                        // })
                                        axios.get('/api/rest/su-yuan-cheng/?page=0&size=10&storeId='+this.state.select_store_item)
                                        .then(res=>{
                                            let data=res.data.content;
                                            let page_number=res.data.pageable.pageNumber+1
                                            let totalElements=res.data.totalElements
                                            let totalPages=res.data.totalPages
                                            this.setState({
                                                data_suyuancheng:data,
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
        // axios.get("/api/rest/store/list/")
        // .then(res=>{
        //     this.setState({
        //         store_list:res.data
        //     })
            
        // })
        // axios.get('/api/rest/goods/?page=0&size=10')
        // .then(res=>{
        //     let data=res.data.content;
        //     let goods_page_number=res.data.pageable.pageNumber+1
        //     let goods_totalElements=res.data.totalElements
        //     let goods_totalPages=res.data.totalPages
        //     this.setState({
        //         data_goods:data,
        //         goods_page_number,
        //         goods_totalElements,
        //         goods_totalPages
        //     })
        // })
    }
    update_Select_store=(e)=>{
        this.setState({
            update_Select_store:e
        })
        
        
    }
    add_store_pagination=(e)=>{
        
        
        this.setState({
            add_select_store_pagination:e
        })
        axios.get('/api/rest/store/?page='+(e-1))
      .then(res=>{
          let store_totalElements=res.data.totalElements,
              store_totalPages=res.data.totalPages;
              this.setState({
                data_store:res.data.content,
                store_totalElements,
                store_totalPages,
          })
      })  
    }
    add_Select_store=(e)=>{

        this.setState({
            add_Select_store:e
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
       
        this.setState({
            page_number:pageNum,
        },()=>{
             let name=this.state.find_name||""
            if(this.state.role=="STORE_MANAGER"){
                axios.get('/api/rest/su-yuan-cheng/?page='+(pageNum-1)+"&machineId="+name)
                .then(res=>{
                    let data=res.data.content;
                    this.setState({
                        data_suyuancheng:data
                    })
                })
            }else{
                axios.get('/api/rest/su-yuan-cheng/?page='+(pageNum-1)+"&machineId="+name+"&storeId="+this.state.select_store_item)
                .then(res=>{
                    let data=res.data.content;
                    this.setState({
                        data_suyuancheng:data
                    })
                })
            }
            
        })}
    inputFind(e){
        this.setState({
            find_name:e.target.value
        })
    }
    handleUpdateSelectStore_Provider=(e)=>{
        axios.get("/api/rest/provider/list?storeId="+e)
        .then(res=>{
            this.setState({
                data_provider:res.data,
                select_store_item:e
            })
        })
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
    doFind(){
        let machineId=this.state.find_name;
        let storeId=this.state.select_store_item
        let select_store=this.state.select_store_item
        if(this.state.role=="STORE_MANAGER"){
            if(machineId&&storeId){
                axios.get(`/api/rest/su-yuan-cheng/?machineId=${machineId}&storeId=${storeId}`)
                .then(res=>{
                let data=res.data.content;
                let find_page_number=res.data.pageable.pageNumber+1
                let find_totalElements=res.data.totalElements
                let find_totalPages=res.data.totalPages
                this.setState({
                    data_suyuancheng:data,
                    page_number:find_page_number,
                    totalElements:find_totalElements,
                })
            })
            }else if(!machineId&&storeId){
                axios.get(`/api/rest/su-yuan-cheng/?&storeId=${storeId}`)
                .then(res=>{
                let data=res.data.content;
                let find_page_number=res.data.pageable.pageNumber+1
                let find_totalElements=res.data.totalElements
                let find_totalPages=res.data.totalPages
                this.setState({
                    data_suyuancheng:data,
                    page_number:find_page_number,
                    totalElements:find_totalElements,
                })
            })
            }else if(machineId&&!storeId){
                axios.get(`/api/rest/su-yuan-cheng/?machineId=${machineId}`)
                .then(res=>{
                let data=res.data.content;
                let find_page_number=res.data.pageable.pageNumber+1
                let find_totalElements=res.data.totalElements
                let find_totalPages=res.data.totalPages
                this.setState({
                    data_suyuancheng:data,
                    page_number:find_page_number,
                totalElements:find_totalElements,
                })
            })
            }else{
                return 
            }
        }else{
            if(machineId&&storeId){
                axios.get(`/api/rest/su-yuan-cheng/?machineId=${machineId}&storeId=${storeId}`)
                .then(res=>{
                let data=res.data.content;
                let find_page_number=res.data.pageable.pageNumber+1
                let find_totalElements=res.data.totalElements
                let find_totalPages=res.data.totalPages
                this.setState({
                    data_suyuancheng:data,
                    page_number:find_page_number,
                    totalElements:find_totalElements,
                })
            })
            }else if(!machineId&&storeId){
                axios.get(`/api/rest/su-yuan-cheng/?&storeId=${storeId}`)
                .then(res=>{
                let data=res.data.content;
                let find_page_number=res.data.pageable.pageNumber+1
                let find_totalElements=res.data.totalElements
                let find_totalPages=res.data.totalPages
                this.setState({
                    data_suyuancheng:data,
                    page_number:find_page_number,
                    totalElements:find_totalElements,
                })
            })
            }else if(machineId&&!storeId){
                axios.get(`/api/rest/su-yuan-cheng/?machineId=${machineId}`)
                .then(res=>{
                let data=res.data.content;
                let find_page_number=res.data.pageable.pageNumber+1
                let find_totalElements=res.data.totalElements
                let find_totalPages=res.data.totalPages
                this.setState({
                    data_suyuancheng:data,
                    page_number:find_page_number,
                    totalElements:find_totalElements,
                })
            })
            }else{
                return 
            }
        }    
    }



    //编辑更新数据
    doUpdate(e){
        
        let value=e.target.parentNode.parentNode;
        let no=value.getAttribute("name");
        let uuid=this.state.data_suyuancheng[no].machineId;
        let name=value.childNodes[0].innerText;
        let remark=value.childNodes[1].innerText;
        let update_Select_store=this.state.data_suyuancheng[no].store.uuid;
        let marketId=this.state.data_suyuancheng[no].store.market.uuid
        axios.get('/api/rest/store/list/?marketId='+marketId)
        .then(res=>{
            let store_totalElements=res.data.totalElements,
                store_totalPages=res.data.totalPages;
                this.setState({
                    data_store:res.data,
            })
        })
        this.setState({
            visible: true,
            update_name:name,
            update_uuid:uuid,
            update_remark:remark,
            update_no:no,
            find_pagination:false,
            update_Select_store
          });
    }
    handleUpdateSelectStore=(e)=>{
        this.setState({
            select_store_item:e,
        })
    }
    //编辑框弹出框点击成功回调
    handleOk = (e) => {
        let names=this.state.find_name||"";
        let data=this.state.data_suyuancheng[this.state.update_no];
        this.setState({
            update_name:data.name,
            update_marketId:data.marketId,
            update_remark:data.remark,
            add_select_store_pagination:1
        })
        
            let readyData={
                machineId:this.state.update_name,
                storeId:this.state.update_Select_store,
                name:"",
                remark:""
            }
            axios.put('/api/rest/su-yuan-cheng/'+data.uuid,readyData)
            .then(res=>{
                this.setState({
                    visible: false,
                },()=>{
                    if(this.state.role=="STORE_MANAGER"){
                    axios.get('/api/rest/su-yuan-cheng/?page=0&size=10'+"&machineId="+names)
                    .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_suyuancheng:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                        axios.get('/api/rest/store/')   
                    .then(res=>{
                        let store_totalElements=res.data.totalElements,
                            store_totalPages=res.data.totalPages;
                            this.setState({
                                add_Select_store:res.data.content[0].uuid,
                                data_store:res.data.content,
                                store_totalElements,
                                store_totalPages,
                        })
                    })
                    })
                }else{
                    axios.get('/api/rest/su-yuan-cheng/?storeId='+this.state.select_store_item+"&machineId="+names)
                    .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_suyuancheng:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                        axios.get('/api/rest/store/')   
                    .then(res=>{
                        let store_totalElements=res.data.totalElements,
                            store_totalPages=res.data.totalPages;
                            this.setState({
                                add_Select_store:res.data.content[0].uuid,
                                data_store:res.data.content,
                                store_totalElements,
                                store_totalPages,
                        })
                    })
                    })
                }
                })
                
                
                this.setState({
                    update_name:"",
                    update_marketId:"",
                    update_remark:"",
                })
                let {marketId,name,remark}=res.data;
                data.marketId=marketId;
                data.name=name;
                data.remark=remark;
                message.success('编辑成功');
                this.setState({
                    visible: false,
                    find_pagination:false
                  });    
            },err=>{
                message.error("输入有误，请重新输入")
            }) 
        }
      //编辑框弹出框失败回调
      handleCancel = (e) => {
        this.setState({
          visible: false,
          add_select_store_pagination:1,
          update_remark:""
        });
      }


    plu_handleOk=(e)=>{
        
        this.setState({
            plu_visible:false
        })
        let header={
            headers:{
                'Content-Type':'application/json ;charset=utf-8'
            }
        }
        let readyData={
            suYuanChengId:this.state.data_suyuancheng[this.state.update_no].uuid,
            goodsId:this.state.add_store_select,
            code:13,
            price:this.state.price
        }
        axios.post('/api/rest/plu/',readyData,header)
        .then(res=>{
            message.success("PLU编码添加成功")
            this.setState({
                add_plu_visible:false,
            })
        },err=>{
            message.error("PLU编码添加失败，请重新输入")
        })
    }
    plu_handleCancel=()=>{
        this.setState({
            plu_visible:false
        })
    }

    add_plu_handleOk=()=>{
        let header={
            headers:{
                'Content-Type':'application/json ;charset=utf-8'
            }
        }
        
        let readyData={
            suYuanChengId:this.state.data_suyuancheng[this.state.update_no].uuid,
            goodsId:this.state.add_store_select,
            code:1,
            price:this.state.price
        }
        axios.post('/api/rest/plu',readyData,header)
        .then(res=>{
            message.success("PLU编码添加成功")
            this.setState({
                add_plu_visible:false,
                add_store_select:'',
            })
        },err=>{
            message.error("PLU编码添加失败，请重新输入")
        })
        
    }
    add_plu_handleCancel=()=>{
        
        this.setState({
            add_plu_visible:false
        })
        
    }




    //删除按钮
    doDelete(e){
        let value=e.target.parentNode.parentNode;
        let name=value.getAttribute("name");
        let uuid=this.state.data_suyuancheng[name].uuid
        this.setState({
            delete_no:name,
            delete_uuid:uuid,
            find_pagination:false
        })  
    }
    //删除框确认时候回调
    confirm=(e)=>{
        let name=this.state.find_name;
        axios.delete('/api/rest/su-yuan-cheng/'+this.state.delete_uuid)
        .then(res=>{
            if(this.state.role=="STORE_MANAGER"){
                this.state.data_suyuancheng.length--;
                if(this.state.data_suyuancheng.length<=0){
                    this.setState({
                        page_number:this.state.page_number-1
                    },()=>{
                        axios.get('/api/rest/su-yuan-cheng/?page='+(this.state.page_number-1)+'&size=10'+"&machineId="+name)
                        .then(res=>{
                            message.success("删除成功")
                            let data=res.data.content;
                            let page_number=res.data.pageable.pageNumber+1
                            let totalElements=res.data.totalElements
                            let totalPages=res.data.totalPages
                            this.setState({
                                data_suyuancheng:data,
                                page_number,
                                totalElements,
                                totalPages
                            })
                        })
                    })  
                }else{
                    axios.get('/api/rest/su-yuan-cheng/?page='+(this.state.page_number-1)+'&size=10'+"&machineId="+name)
                    .then(res=>{
                        message.success("删除成功")
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_suyuancheng:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                    })
                }
            }else {
                this.state.data_suyuancheng.length--;
                if(this.state.data_suyuancheng.length<=0){
                    this.setState({
                        page_number:this.state.page_number-1
                    },()=>{
                        axios.get('/api/rest/su-yuan-cheng/?page='+(this.state.page_number-1)+'&size=10&storeId='+this.state.select_store_item+"&machineId="+name)
                        .then(res=>{
                            message.success("删除成功")
                            let data=res.data.content;
                            let page_number=res.data.pageable.pageNumber+1
                            let totalElements=res.data.totalElements
                            let totalPages=res.data.totalPages
                            this.setState({
                                data_suyuancheng:data,
                                page_number,
                                totalElements,
                                totalPages
                            })
                        })
                    })  
                }else{
                    axios.get('/api/rest/su-yuan-cheng/?page='+(this.state.page_number-1)+'&size=10&storeId='+this.state.select_store_item+"&machineId="+name)
                    .then(res=>{
                        message.success("删除成功")
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_suyuancheng:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                    })
                }
            }
           
        },err=>{
            message.error("删除失败，请确认溯源秤是否还绑定有PLU编码")
        })
        
        
      }
      //删除框取消时候回调
      cancel=(e)=>{
        message.error('删除失败');
      }



    createstore(){
        this.setState({
            add_visible:true
        })
    }
    createstoreChangeVisible(){
        this.setState({
            add_visible:false,
            find_pagination:false
        },()=>{
                axios.get('/api/rest/store/?page=0&size=10')
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
            selectQuery:value
        })
      }

      plu_btn=(e)=>{
          axios.get('/api/rest/plu/')
          .then(res=>{
            let page_number=res.data.pageable.pageNumber+1
            let totalElements=res.data.totalElements
            this.setState({
                plu_visible:true,
                data_plu:res.data.content,
                plu_page_number:page_number,
                plu_totalElements:totalElements
            })
          })
      }
      add_plu_btn=(e)=>{
          if(this.state.role=="STORE_MANAGER"){
            let no=e.target.parentNode.parentNode.getAttribute('name');
            axios.get('/api/rest/goods/list')
            .then(res=>{
                let data=res.data;
                this.setState({
                    data_goods:data,
                    plu_visible:true,
                    update_no:no
                })
            })
          }else{
            axios.get('/api/rest/goods/list/?storeId='+this.state.select_store_item)
            .then(res=>{
                let data=res.data;
                this.setState({
                    data_goods:data,
                    plu_visible:true,
                })
            })
          }
      }
      createMarket=()=>{
          if(this.state.role=="STORE_MANAGER"){
            this.setState({
                add_visible:true
            })
          }else{
            axios.get('/api/rest/store/')
            .then(res=>{
            let store_totalElements=res.data.totalElements,
                store_totalPages=res.data.totalPages;
                this.setState({
                //   add_Select_store:res.data.content[0].uuid,
                  data_store:res.data.content,
                  store_totalElements,
                  store_totalPages,
                  add_visible:true
                  
            })
        })
          }
        
      }
      add_handleCancel=()=>{
          this.setState({
              add_visible:false
          })
      }
      doReset=()=>{
          if(this.state.role=="STORE_MANAGER"){
            axios.get('/api/rest/su-yuan-cheng/')
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let totalElements=res.data.totalElements
                let totalPages=res.data.totalPages
                this.setState({
                    data_suyuancheng:data,
                    page_number,
                    totalElements,
                    totalPages,
                    find_name:"",
                    selectQuery:""
                })
             
            })
          }else{
            axios.get('/api/rest/su-yuan-cheng/?storeId='+this.state.select_store_item)
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let totalElements=res.data.totalElements
                let totalPages=res.data.totalPages
                this.setState({
                    data_suyuancheng:data,
                    page_number,
                    totalElements,
                    totalPages,
                    find_name:"",
                    selectQuery:""
                })
             
            })
          }

      }
      add_handleOk=()=>{
        let storeId=this.state.add_Select_store,
            machineId=this.state.update_machineId,

             goodsId=""
            if(this.state.role=="STORE_MANAGER"){
                storeId=this.state.uuid
                
            }else {
                storeId=this.state.select_store_item
            }
          let readyData={
              storeId,
              machineId
          }
          let header={
              headers:{
                  'Content-Type':'Application/json;charset=utf-8'
              }
          }
        axios.post('/api/rest/su-yuan-cheng/',readyData,header)
        .then(res=>{
            if(this.state.role=="STORE_MANAGER"){
                axios.get(`/api/rest/su-yuan-cheng/?machineId=${this.state.find_name}`)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_suyuancheng:data,
                        page_number,
                        totalElements,
                        totalPages,
                        update_address:"",
                        update_remark:"",
                        add_store_select:"",
                        machineId:" ",
                        update_machineId:"",
                        add_Select_store:"",
                        add_select_store_pagination:1,
                        add_visible:false,
                    })
                })
            }else if(this.state.role=="MARKET_MANAGER"){
                
                axios.get(`/api/rest/su-yuan-cheng/?storeId=${storeId}&machineId=${this.state.find_name}`)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_suyuancheng:data,
                        page_number,
                        totalElements,
                        totalPages,
                        update_address:"",
                        update_remark:"",
                        add_store_select:"",
                        machineId:" ",
                        update_machineId:"",
                        add_visible:false,
                        add_Select_store:"",
                        add_select_store_pagination:1
                    })
                })
            }  
            else{
                axios.get(`/api/rest/su-yuan-cheng/?storeId=${storeId}&machineId=${this.state.find_name}`)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_suyuancheng:data,
                        page_number,
                        totalElements,
                        totalPages,
                        update_address:"",
                        update_remark:"",
                        add_store_select:"",
                        machineId:" ",
                        update_machineId:"",
                        add_visible:false,
                        add_Select_store:"",
                        add_select_store_pagination:1
                    })
                })
            }


            },(err)=>{
                message.error('添加溯源秤失败,有重复数据')
            }
        )
    }
    add_handleCancel_test=()=>{
        this.setState({
            plu_visible:false
        })
    }
        add_handleOk_test=(e)=>{
        
            
            let header={
                headers:{
                    'Content-Type':'application/json ;charset=utf-8'
                }
            }
            
            let readyData=[{
                suYuanChengId:this.state.data_suyuancheng[this.state.update_no].uuid,
                goodsId:this.state.add_store_select,
                code:this.state.update_address,
                price:this.state.update_remark
            }]
            axios.post('/api/rest/plu/',readyData,header)
            .then(res=>{
                message.success("PLU编码添加成功")
                this.setState({
                    plu_visible:false,
                    add_store_select:"",
                    update_address:"",
                    update_remark:""
                })
            },err=>{
                message.error("PLU编码添加失败，请重新输入")
            })
        }


      add_Select=(e,v)=>{
        this.setState({
            add_store_select:e
        })
              
    }
    onChange_price=(e,v)=>{
        this.setState({
            price:e
        })   
    }
    onChange_code=(e)=>{
        this.setState({
            code:e
        })
    }
    // add_store_pagination=(e)=>{
    //     this.setState({
    //         store_pageNumber:e
    //     })
    // }
    add_goods_pagination=(e)=>{
        this.setState({
            goods_pageNumber:e
        })
        axios.get('/api/rest/goods/?page='+(e-1))
          .then(res=>{
              let goods_totalElements=res.data.totalElements,
                  goods_totalPages=res.data.totalPages;
                  this.setState({
                    data_goods:res.data.content,
                    goods_totalElements,
                    goods_totalPages,
              })
          })
    }
    render(){
        return (
            
            <div id="page-wrapper">
            <div style={{ background: '#ECECEC', padding: '30px' ,padding:"20px" }}>
                    <Card title="溯源秤详情" bordered={false} style={{ width: "100%" ,padding:"24 11"}} >
                    <div>
                        <span className="query">溯源秤编号 : </span> 
                        
                        <input type="text" class="form-control input" style={{marginRight:5}} placeholder="请输入溯源秤编号" value={this.state.find_name } onChange={e=>this.inputFind(e)} />  
                                {
                                    this.state.role==="ADMINISTRATOR"?
                                    <span>
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
                            {
                                this.state.role=="MARKET_MANAGER"?
                                <span>
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
                    </div>
                    <div><Button  className="add-btn" onClick={()=>this.createMarket()}><i className="fa fa-plus "></i>添加溯源秤</Button></div>
                    </Card>
                </div>  
            <div className="row">
                    <div className="col-md-12"  >
                    <Spin spinning={this.state.loading} >
                        <table className="table table-striped" >
                            <thead >
                                <tr >
                                    <th>溯源秤编号</th>
                                    <th>所属商铺</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            {/* <td><Button><Link key={index} name={value.uuid} to={'/data-suyuancheng-add-plu/'+value.uuid}>添加PLU编码</Link></Button></td> */}
                                    {this.state.data_suyuancheng.map((value,index)=>{
                                        return (
                                            <tr name={index.toString()}>
                                                <td>{value.machineId}</td>
                                                <td>{value.store.name}</td>
                                                <td><Button type="primary" className="btn" onClick={(e)=>{this.doUpdate(e)}}>编辑</Button>
                                                    <Popconfirm title="确认删除 ？" onConfirm={this.confirm} onCancel={this.cancel} okText="确认" cancelText="取消">
                                                         <Button type="danger" className="btn" onClick={(e)=>{this.doDelete(e)}}>删除</Button>
                                                    </Popconfirm>
                                                </td>
                                                <td><Button name={value.uuid}  onClick={(e)=>{this.add_plu_btn(e)}}>添加PLU编码</Button></td>
                                                <td><Button><Link key={index} name={value.uuid} to={'/info/data-suyuancheng-plu/'+value.uuid}>查看PLU编码列表</Link></Button></td>
                                            </tr> 
                                        )
                                    })
                                }
                            </tbody>
                            </table>
                            </Spin>
                        </div> 
                        </div>
                   
                {/* {
                    this.state.find_pagination?
                    
                    <Pagination current={this.state.find_page_number} 
                                total={this.state.find_totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.find_changeNumber(pageNum)}}/>:
                   
                } */}
                <Pagination current={this.state.page_number} 
                                total={this.state.totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.changeNumber(pageNum)}}/>

        <div>
        <Modal
          title={"添加PLU编码111"}
          okText="确定"
          cancelText="取消"
          width="820px"
          height="800px"
          visible={this.state.plu_visible1}
          onOk={e=>this.plu_handleOk(e)}
          onCancel={this.plu_handleCancel}>
          <table border="1px" className="pluList" >
                <tr>
                    <th>PLU编号</th>
                    <th>商品</th>
                    <th>价格</th>
                </tr>
                {
                    this.state.array
                }
                    {/* {
                        this.state.arrayPrice.map((value,index)=>{
                            return (
                            <tr name={index}>
                                <td>{index+1}</td>
                                <td>
                                    <Select  style={{ width: 120 }} onChange={(e,v,z)=>{this.add_Select(e,v,z)}} >
                                        {
                                            this.state.data_goods.map((value,index)=>{
                                            return (
                                                <Option value={value.uuid} key={index}>{value.name}</Option>
                                            )
                                        })
                                        } 
                                    </Select>
                                </td>
                                <td>
                                <InputNumber
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    onChange={(e,v)=>{this.onChange_price(e,v)}}
                                    onClick={e=>{console.log(e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("name"))}}
                                    />
                                </td>
                            </tr>
                            )
                        })
                    } */}
                    
          </table>
        </Modal>
        <Modal
          visible={this.state.plu_visible}
          title="添加PLU编码"   //TEST
          onOk={this.add_handleOk_test}
          onCancel={this.add_handleCancel_test}
          footer={[
            <Button key="back" onClick={this.add_handleCancel_test}>取消</Button>,
            <Button key="submit" className="add_modal_btn" type="primary" loading={this.state.add_loading} onClick={this.add_handleOk_test}>
              确定
            </Button>,
          ]}
        >
         <div>
         <Row type="flex" className="add_modal" justify="start" >
                 <Col span={5}   >PLU编号 :</Col>
                 <Col span={15}><Input type="text"  name="update_address" value={this.state.update_address}  onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             <Row type="flex" className="add_modal" justify="start">
                 <Col span={5}  >商品名称 :</Col>
                 <Col span={15}>
                    <Select  
                            showSearch
                            filterOption={(input,option)=>option.props.children.indexOf(input)>=0>=0}
                            style={{ width: 296}} 
                            onChange={(e)=>{this.add_Select(e)}}>
                        {
                            this.state.data_goods.map((value,index)=>{
                            return (
                                <Option value={value.uuid} key={index}>{value.name}</Option>
                            )
                        })
                        } 
                    </Select>
                </Col>
             </Row>
             
             <Row type="flex" className="add_modal" justify="start" >
                 <Col span={5}   >价格 :</Col>
                 <Col span={15}><Input type="text" name="update_remark" value={this.state.update_remark} onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
         </div>
        </Modal>
        <Modal
          title="编辑溯源秤"
          okText="确定"
          cancelText="取消"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            <div>
             <Row type="flex" className="add_modal" justify="start" >
                 <Col span={5}   >溯源秤编号 :</Col>
                 <Col span={15}><Input type="text"  name="update_name" value={this.state.update_name}  onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             {this.state.role!=="STORE_MANAGER"?
             <Row type="flex" className="add_modal" justify="start">
                 <Col span={5}  >商铺名称 :</Col>
                 <Col span={15}>
                    <Select  style={{ width: 296 }} 
                    showSearch
                    filterOption={(input,option)=>option.props.children.indexOf(input)>=0>=0}
                    onChange={(e)=>{this.update_Select_store(e)}} 
                    value={this.state.update_Select_store}>
                        {
                            this.state.data_store.map((value,index)=>{
                            return (
                                <Option value={value.uuid} key={index}>{value.name}</Option>
                            )
                        })
                        } 
                    </Select>
                    
                    
                </Col>
             </Row>:null}
            </div> 
        </Modal>
        <Modal
          visible={this.state.add_visible}
          title="添加溯源秤"
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
         {/* <Row type="flex" className="add_modal" justify="start" >
                 <Col span={5}   >溯源秤名称 :</Col>
                 <Col span={15}><Input type="text"  name="update_name" value={this.state.update_name}  onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row> */}
             <Row type="flex" className="add_modal" justify="start" >
                 <Col span={5}   >溯源秤编号 :</Col>
                 <Col span={15}><Input type="text"  name="update_machineId" value={this.state.update_machineId}  onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row>
             {
                    this.state.role=="MARKET_MANAGER"?
                    <Row type="flex" className="add_modal" justify="start">
                        <Col span={5}  >商铺名称 :</Col>
                        <Col span={15}>
                            <Select  style={{ width: 296 }} onChange={(e)=>{this.add_Select_store(e)}} value={this.state.add_Select_store}>
                                {
                                    this.state.select_store.map((value,index)=>{
                                    return (
                                        <Option value={value.uuid} key={index}>{value.name}</Option>
                                    )
                                })
                                } 
                            </Select>
                        </Col>
                    </Row>:null
            }
            {
                    this.state.role=="ADMINISTRATOR"?
                    <Row type="flex" className="add_modal" justify="start" >
                        <Col span={5}   >商铺名称 ：</Col>
                        <Col span={15}>
                            <Select 
                                        style={{ width: 148}} 
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
                                    style={{ width: 147 }} 
                                    showSearch 
                                    placeholder="请选择商铺名称"
                                    optionFilterProp="children"
                                    type="text"
                                    name="update_storeId" 
                                    value={this.state.select_store_item} 
                                    filterOption={(input,option)=>option.props.children.indexOf(input)>=0}
                                    onChange={(e)=>{this.handleUpdateSelectStore_Provider(e)}}>
                                    {this.state.select_store.map((value,index)=>{
                                        return (<Option value={value.uuid}>{value.name}</Option>)
                                    })}
                                   
                                </Select>
                                <Spin spinning={this.state.loading} />
                        </Col>
                    </Row>:null
                    
                }
             
             
             {/* <Row type="flex" className="add_modal" justify="start" >
                 <Col span={5}   >备注 :</Col>
                 <Col span={15}><Input type="text" name="update_remark" value={this.state.update_remark} onChange={(e)=>{this.handleUpdate(e)}}/></Col>
             </Row> */}
         </div>
        </Modal>
        </div>
            </div>
           
        )
    }
}