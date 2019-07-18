
import React,{Component} from 'react'
import PageTitle from '../../../component/page'
import Pagination from 'rc-pagination';
import moment from 'moment';
import axios from 'axios'
import "antd/dist/antd.css";
import{Link} from 'react-router-dom'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { Modal, Button,Popconfirm, message,Select,DatePicker ,Row,Col,Input,Card,Radio,Spin } from 'antd';
import Alert from '../../../component/alert'
import '../index.css'
import 'rc-pagination/dist/rc-pagination.min.css'
import util from '../../../util/fun'
import fun from '../../../component/select'
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const RadioGroup = Radio.Group;
export default class ProductGoods extends Component{
    constructor(props){
        super(props);
        this.state={
            data_goods:[],//获取到的数据dawdawd
            page_number:0,
            totalElements:1,
            totalPages:1,//数据页面
            find_name:"",
            find_pagination:false,
            find_page_number:0,
            find_totalElements:1,
            visible:false,//编辑显示框控制
            update_visible: true,
            update_name:"",
            update_fullName:"",
            update_provider:"",
            update_purchaseDate:moment(),
            update_storeId:"",
            update_uuid:"",
            update_remark:"",
            update_no:0,
            delete_uuid:"",//删除的数据的key 
            delete_no_find:"",
            params:'',
            add_visible:false,
            selectQuery:"name",
            add_true:false,
            date:"",
            find_date:[],
            update_visible:false,
            data_store:[],
            data_provider:[[{
                "name": "",
                "remark": "",
                "updateTime": "",
                "uuid": ""
            }]],
            market_totalElements:1,
            market_totalPages:1,
            icon_up:false,
            add_store_select:"",
            provider_totalElements:1,
            provider_totalPages:1,
            add_Select_store:"",
            add_Select_provider:"",
            add_select_provider_pagination:1,
            add_select_store_pagination:1,
            update_Select_provider:"",
            update_Select_store:"",
            checked:false,
            uuid:"",
            role:"",
            update_qty:"",
            RESET:"",
            uuid_market:"",
            loading:true,
            update_unit:"kg",
            STOREID:"",
            show_reset_picker:false,
            select_market:[{uuid:""}],
            select_market_item:"",
            select_store_item:"",
            select_store:[{uuid:""}],
            }
            
    }
    componentDidMount(){
        // axios.get('/api/rest/goods/list?storeId='+res.)
        //         .then(res=>{
                    
        //             let data=res.data.content;
        //             let page_number=res.data.pageable.pageNumber+1
        //             let totalElements=res.data.totalElements
        //             let totalPages=res.data.totalPages
        //             this.setState({
        //                 data_goods:data,
        //                 page_number,
        //                 totalElements,
        //                 totalPages
        //             })
        //         })
        axios.get('/api/rest/user/user-info')
        .then(res=>{
            if(res.status!=200){
                this.props.history.push('/login')
            }
           this.setState({
               role:fun.select(res.data.roles)
           },()=>{
               if(fun.select(res.data.roles)=="MARKET_MANAGER"){
                    this.setState({
                        uuid_market:res.data.market.uuid,
                        marketId:res.data.market.uuid
                    })
                    axios.get('/api/rest/store/list?marketId='+res.data.market.uuid)
                    .then(res=>{
                         if(res.data.length<=0){
                                this.setState({
                                    loading:false
                                })
                                }else{
                                    this.setState({
                                        select_store:res.data,
                                        loading:false,
                                        select_store_item:res.data[0].uuid
                                    })
                                    axios.get('/api/rest/goods/?storeId='+res.data[0].uuid)
                                    .then(res=>{
                                        let data=res.data.content;
                                        let page_number=res.data.pageable.pageNumber+1
                                        let totalElements=res.data.totalElements
                                        let totalPages=res.data.totalPages
                                        this.setState({
                                            loading:false,
                                            data_goods:data,
                                            page_number,
                                            totalElements,
                                            totalPages,
                                            
                                        })
                                    })
                                }
                                })
                       
                     
               }else if(fun.select(res.data.roles)=="ADMINISTRATOR"){
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
                                        axios.get('/api/rest/goods/?storeId='+res.data[0].uuid)
                                        .then(res=>{
                                            let data=res.data.content;
                                            let page_number=res.data.pageable.pageNumber+1
                                            let totalElements=res.data.totalElements
                                            let totalPages=res.data.totalPages
                                            this.setState({
                                                data_goods:data,
                                                page_number,
                                                totalElements,
                                                loading:false,
                                                totalPages
                                            })
                                        })
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
               
               
               
               
               
               
               
               
               else{
                   axios.get('/api/rest/goods/')
                   .then(res=>{
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                     let totalPages=res.data.totalPages
                   this.setState({
                        loading:false,
                        data_goods:res.data.content,
                        page_number,
                        totalElements,
                        totalPages                        
                   })
                   }
                    )
               }
           })
        },()=>{
            this.props.history.push('/login')
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
    
    onChangeDate=(data,DATA)=>{
        this.setState({
            date:DATA
        })
    }

    onChangeUpdateDate=(data,DATA)=>{
        this.setState({
            update_purchaseDate:data
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
        let name=this.state.name||"",
            fullName=this.state.fullName,
            date=Array.from(this.state.find_date),
            before=date.splice(0,1).toString(),
            after=date.splice(0,1).toString();
            
        this.setState({
            page_number:pageNum,
        },()=>{
            if(this.state.role=="STORE_MANAGER"){
                axios.get('/api/rest/goods/?page='+(pageNum-1)+"&name="+name+"&before="+before+"&after="+after)
                .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let find_totalPages=res.data.totalPages
                        this.setState({
                            data_goods:data,
                            page_number,
                            totalElements,
                            select_store_item:this.state.select_store_item
                        })
                })
            }else{
                axios.get('/api/rest/goods/?page='+(pageNum-1)+"&storeId="+this.state.select_store_item+"&name="+name+"&before="+before+"&after="+after)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let find_totalPages=res.data.totalPages
                    this.setState({
                        data_goods:data,
                        page_number,
                        totalElements,
                        select_store_item:this.state.select_store_item
                    })
                })
            }
           
        })}
        find_changeNumber(pageNum){
            let value=this.state.find_name;
            this.setState({
                find_page_number:pageNum,
            },()=>{
                axios.get('/api/rest/goods/?page='+(pageNum-1)+'&'+this.state.selectQuery+'='+value)
                .then(res=>{
                    let data=res.data.content;
                    this.setState({
                        data_goods:data
                    })
                })
            })}
    inputFind(e){
        let name=e.target.getAttribute("name")
        
        this.setState({
            [name]:e.target.value
        })
    }
    //搜索功能
    doFind(){
        let name=this.state.name||"",
            fullName=this.state.fullName||"",
            date=Array.from(this.state.find_date),
            before=date.splice(0,1).toString(),
            after=date.splice(0,1).toString();
            
            
            if(this.state.role!="STORE_MANAGER"){
               
                    axios.get(`/api/rest/goods/?${this.state.selectQuery}=${name}&before=${before}&after=${after}&fullName=${fullName}`
                    +"&storeId="+this.state.select_store_item)
                    .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let find_totalPages=res.data.totalPages
                        this.setState({
                            data_goods:data,
                            page_number,
                            totalElements,
                            select_store_item:this.state.select_store_item
                        })
                    })
            
            }else{
                axios.get(`/api/rest/goods/?${this.state.selectQuery}=${name}&before=${before}&after=${after}&fullName=${fullName}`
                    +"&storeId="+this.state.select_store_item)
                    .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let find_totalPages=res.data.totalPages
                        this.setState({
                            data_goods:data,
                            page_number,
                            totalElements,
                            select_store_item:this.state.select_store_item
                        })
                    })
            }
            // else if(this.state.role!="ADMINISTRATOR"){
            //     axios.get(`/api/rest/goods/?${this.state.selectQuery}=${name}&before=${before}&after=${after}&fullName=${fullName}`
            //     +"&storeId="+this.state.select_store_item)
            //     .then(res=>{
            //         let data=res.data.content;
            //         let page_number=res.data.pageable.pageNumber+1
            //         let totalElements=res.data.totalElements
            //         let find_totalPages=res.data.totalPages
            //         this.setState({
            //             data_goods:data,
            //             page_number,
            //             totalElements,
            //             select_store_item:this.state.select_store_item
            //         })
            //     })
            // }
            //     }else if(fullName&&name&&!before){
            //         axios.get(`/api/rest/goods/?${this.state.selectQuery}=${name}&before=${before}&after=${after}&fullName=${fullName}`+"&storeId="+this.state.select_store_item)
            //         .then(res=>{
            //             let data=res.data.content;
            //             let find_page_number=res.data.pageable.pageNumber+1
            //             let find_totalElements=res.data.totalElements
            //             let find_totalPages=res.data.totalPages
            //             this.setState({
            //                 data_goods:data,
            //                 find_page_number,
            //                 find_totalElements,
            //                 select_store_item:this.state.select_store_item
            //             })
            //         })
            //     }
                // else if(name&&!before&&!fullName){
                //     axios.get(`/api/rest/goods/?name=${name}`+"&storeId="+this.state.select_store_item)
                //     .then(res=>{
                //         let data=res.data.content;
                //         let find_page_number=res.data.pageable.pageNumber+1
                //         let find_totalElements=res.data.totalElements
                //         let find_totalPages=res.data.totalPages
                //         // if(data.length<=0){
                //         //     message.error("请输入正确的查询条件")
                //         // }
                //         this.setState({
                //             data_goods:data,
                //             find_page_number,
                //             find_totalElements,
                //             select_store_item:this.state.select_store_item
                //         })
                //     })
                // }
                // else if(!name&&before&&!fullName){
                //     axios.get(`/api/rest/goods/?before=${before}&after=${after}`+"&storeId="+this.state.select_store_item)
                //     .then(res=>{
                //         let data=res.data.content;
                //         let find_page_number=res.data.pageable.pageNumber+1
                //         let find_totalElements=res.data.totalElements
                //         let find_totalPages=res.data.totalPages
                //         // if(data.length<=0){
                //         //     message.error("请输入正确的查询条件")
                //         // }
                //         this.setState({
                //             data_goods:data,
                //             find_page_number,
                //             find_totalElements,
                //             select_store_item:this.state.select_store_item
                //         })
                //     })
                // }
                // else if(!name&&!before&&fullName){
                //     axios.get(`/api/rest/goods/?fullName=${fullName}`+"&storeId="+this.state.select_store_item)
                //     .then(res=>{
                //         let data=res.data.content;
                //         let find_page_number=res.data.pageable.pageNumber+1
                //         let find_totalElements=res.data.totalElements
                //         let find_totalPages=res.data.totalPages
                       
                //         this.setState({
                //             data_goods:data,
                //             find_page_number,
                //             find_totalElements,
                //             select_store_item:this.state.select_store_item
                //         })
                //     })
                // }
            //     else if(!name&&before&&fullName){
            //         axios.get(`/api/rest/goods/?before=${before}&after=${after}&fullName=${fullName}`+"&storeId="+this.state.select_store_item)
            //         .then(res=>{
            //             let data=res.data.content;
            //             let find_page_number=res.data.pageable.pageNumber+1
            //             let find_totalElements=res.data.totalElements
            //             let find_totalPages=res.data.totalPages
            //             this.setState({
            //                 data_goods:data,
            //                 find_page_number,
            //                 find_totalElements,
            //                 select_store_item:this.state.select_store_item
            //             })
            //         })
            //     }
            //     else if(before&&!name&&!fullName){
            //         axios.get(`/api/rest/goods/?before=${before}&after=${after}`+"&storeId="+this.state.select_store_item)
            //         .then(res=>{
            //             let data=res.data.content;
            //             let find_page_number=res.data.pageable.pageNumber+1
            //             let find_totalElements=res.data.totalElements
            //             let find_totalPages=res.data.totalPages
            //             this.setState({
            //                 data_goods:data,
            //                 find_page_number,
            //                 find_totalElements,
            //                 select_store_item:this.state.select_store_item
            //             })
            //         })
            //     }else{
            //         axios.get("/api/rest/goods/?storeId="+this.state.select_store_item)
            //         .then(res=>{
                        
            //             let data=res.data.content;
            //             let page_number=res.data.pageable.pageNumber+1
            //             let totalElements=res.data.totalElements
            //             let totalPages=res.data.totalPages
            //             this.setState({
            //                 data_goods:data,
            //                 page_number,
            //                 totalElements,
            //                 select_store_item:this.state.select_store_item
            //             })
            //         })
            //     } 
            // }else



        // if(name&&before&&fullName){
        //     axios.get(`/api/rest/goods/?${this.state.selectQuery}=${name}&before=${before}&after=${after}&fullName=${fullName}`)
        //     .then(res=>{
        //         let data=res.data.content;
        //         let find_page_number=res.data.pageable.pageNumber+1
        //         let find_totalElements=res.data.totalElements
        //         let find_totalPages=res.data.totalPages
        //         this.setState({
        //             data_goods:data,
        //             find_page_number,
        //             find_totalElements,
        //             select_store_item:this.state.select_store_item
        //         })
        //     })
        // }else if(fullName&&name&&!before){
        //     axios.get(`/api/rest/goods/?${this.state.selectQuery}=${name}&fullName=${fullName}`)
        //     .then(res=>{
        //         let data=res.data.content;
        //         let find_page_number=res.data.pageable.pageNumber+1
        //         let find_totalElements=res.data.totalElements
        //         let find_totalPages=res.data.totalPages
        //         // if(data.length<=0){
        //         //     message.error("请输入正确的查询条件")
        //         // }
        //         this.setState({
        //             data_goods:data,
        //             find_page_number,
        //             find_totalElements,
        //             select_store_item:this.state.select_store_item
        //         })
        //     })
        // }
        // else if(name&&!before&&!fullName){
        //     axios.get(`/api/rest/goods/?name=${name}`)
        //     .then(res=>{
        //         let data=res.data.content;
        //         let find_page_number=res.data.pageable.pageNumber+1
        //         let find_totalElements=res.data.totalElements
        //         let find_totalPages=res.data.totalPages
        //         // if(data.length<=0){
        //         //     message.error("请输入正确的查询条件")
        //         // }
        //         this.setState({
        //             data_goods:data,
        //             find_page_number,
        //             find_totalElements,
        //             select_store_item:this.state.select_store_item
        //         })
        //     })
        // }
        // else if(!name&&before&&!fullName){
        //     axios.get(`/api/rest/goods/?before=${before}&after=${after}`)
        //     .then(res=>{
        //         let data=res.data.content;
        //         let find_page_number=res.data.pageable.pageNumber+1
        //         let find_totalElements=res.data.totalElements
        //         let find_totalPages=res.data.totalPages
        //         // if(data.length<=0){
        //         //     message.error("请输入正确的查询条件")
        //         // }
        //         this.setState({
        //             data_goods:data,
        //             find_page_number,
        //             find_totalElements,
        //             select_store_item:this.state.select_store_item
        //         })
        //     })
        // }
        // else if(!name&&!before&&fullName){
        //     axios.get(`/api/rest/goods/?fullName=${fullName}`)
        //     .then(res=>{
        //         let data=res.data.content;
        //         let find_page_number=res.data.pageable.pageNumber+1
        //         let find_totalElements=res.data.totalElements
        //         let find_totalPages=res.data.totalPages
        //         // if(data.length<=0){
        //         //     message.error("请输入正确的查询条件")
        //         // }
        //         this.setState({
        //             data_goods:data,
        //             find_page_number,
        //             find_totalElements,
        //             select_store_item:this.state.select_store_item
        //         })
        //     })
        // }
        // else if(!name&&before&&fullName){
        //     axios.get(`/api/rest/goods/?before=${before}&after=${after}&fullName=${fullName}`)
        //     .then(res=>{
        //         let data=res.data.content;
        //         let find_page_number=res.data.pageable.pageNumber+1
        //         let find_totalElements=res.data.totalElements
        //         let find_totalPages=res.data.totalPages
        //         this.setState({
        //             data_goods:data,
        //             find_page_number,
        //             find_totalElements,
        //             select_store_item:this.state.select_store_item
        //         })
        //     })
        // }
        // else if(before&&!name&&!fullName){
        //     axios.get(`/api/rest/goods/?before=${before}&after=${after}`)
        //     .then(res=>{
        //         let data=res.data.content;
        //         let find_page_number=res.data.pageable.pageNumber+1
        //         let find_totalElements=res.data.totalElements
        //         let find_totalPages=res.data.totalPages
        //         this.setState({
        //             data_goods:data,
        //             find_page_number,
        //             find_totalElements,
        //             select_store_item:this.state.select_store_item
        //         })
        //     })
        // }else{
            
        // } 
    }
    //搜索功能



    //编辑更新数据
    doUpdate(e){
        
        let value=e.target.parentNode.parentNode;
        let no=value.getAttribute("name");
        let data=this.state.data_goods[no];
        let STOREID=data.provider.store.uuid
        let uuid=data.uuid;
        let name=value.childNodes[0].innerText;
        let fullName=value.childNodes[1].innerText;
        let purchaseDate=moment(this.state.data_goods[no].purchaseDate);
        let provider=data.provider.uuid
        let storeId=data.provider.store.uuid
        let remark=value.childNodes[6].innerText;
        let checked=this.state.data_goods[no].sellOut;
        let qty=this.state.data_goods[no].qty,
            update_unit=this.state.data_goods[no].unit;
        this.setState({
            update_visible: true,
            update_name:name,
            update_fullName:fullName,
            update_provider:provider,
            update_purchaseDate:purchaseDate,
            update_storeId:storeId,
            update_uuid:uuid,
            update_remark:remark,
            update_no:no,
            update_Select_store:storeId,
            update_Select_provider:provider,
            STOREID:STOREID,
            update_qty:qty,
            update_unit,
            checked
          });
          axios.get('/api/rest/provider/list?storeId='+storeId)
          .then(res=>{
                  this.setState({
                    // add_Select_provider:res.data.content[0].uuid,
                    data_provider:res.data,
                    provider_totalElements:res.data.totalElements,
                    provider_totalPages:res.data.totalPages,
              })
          })
          axios.get('/api/rest/store/')
          .then(res=>{
              let store_totalElements=res.data.totalElements,
                  store_totalPages=res.data.totalPages;
                  this.setState({
                    // add_Select_store:res.data.content[0].uuid,
                    data_store:res.data.content,
                    store_totalElements,
                    store_totalPages,
              })
          })
         
    }
    //编辑框弹出框点击成功回调
    handleOk = (e) => {
        let data=this.state.data_goods[this.state.update_no];
        this.setState({
            update_name:data.name,
            update_marketId:data.marketId,
            update_remark:data.remark,
        })
            let readyData={
                marketId:data.market.uuid,
                name:this.state.update_name,
                remark:this.state.update_remark
            }
            axios.put('/api/rest/goods/'+data.uuid,readyData)
            .then(res=>{
                let {marketId,name,remark}=res.data;
                data.marketId=marketId;
                data.name=name;
                data.remark=remark;
                message.success('编辑成功');
                this.setState({
                    visible: false,
                    update_name:name,
                    update_marketId:marketId,
                    update_remark:remark,
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
        });
      }







    //删除按钮
    doDelete(e){
        let value=e.target.parentNode.parentNode;
        let name=value.getAttribute("name");
        let uuid=this.state.data_goods[name].uuid
        this.setState({
            delete_no:name,
            delete_uuid:uuid,
            find_pagination:false
        })  
    }
    //删除框确认时候回调
    confirm=(e)=>{
       
        
        let name=this.state.name||"",
        date=Array.from(this.state.find_date),
        before=date.splice(0,1),
        after=date.splice(0,1);
        if(this.state.role=="STORE_MANAGER"){
            axios.delete('/api/rest/goods/'+this.state.delete_uuid)
        .then(res=>{
            if(this.state.find_pagination){
                axios.get('/api/rest/goods/?page='+(this.state.find_page_number-1)+"&name="+name+"&before="+before+"&after="+after)
                .then(res=>{
                    message.success("删除成功")
                    let data=res.data.content;
                    let find_page_number=res.data.pageable.pageNumber+1
                    let find_totalElements=res.data.totalElements
                    let find_totalPages=res.data.totalPages
                    this.setState({
                        data_goods:data,
                        find_page_number,
                        find_totalElements,
                        find_totalPages
                    })
                })
            }else{
                this.state.data_goods.length--;
                if(this.state.data_goods.length<=0){
                    this.setState({
                        page_number:this.state.page_number-1
                    },()=>{
                        axios.get('/api/rest/goods/?page='+(this.state.page_number-1)+'&size=10'+"&name="+name+"&before="+before+"&after="+after)
                        .then(res=>{
                            message.success("删除成功")
                            let data=res.data.content;
                            let page_number=res.data.pageable.pageNumber+1
                            let totalElements=res.data.totalElements
                            let totalPages=res.data.totalPages
                            this.setState({
                                data_goods:data,
                                page_number,
                                totalElements,
                                totalPages
                            })
                        })
                    })
                }else{
                    axios.get('/api/rest/goods/?page='+(this.state.page_number-1)+'&size=10'+"&name="+name+"&before="+before+"&after="+after)
                    .then(res=>{
                        message.success("删除成功")
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_goods:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                    })
                    }
            }
           
        },err=>{
            message.error("删除失败，请确认溯源秤是否绑定该商品")
        },()=>{
            message.error("删除失败，请确认溯源秤是否绑定该商品")      
        })
        }else if(this.state.role=="MARKET_MANAGER"){
            axios.delete('/api/rest/goods/'+this.state.delete_uuid)
        .then(res=>{
            if(this.state.find_pagination){
                axios.get('/api/rest/goods/?storeId=page='+(this.state.find_page_number-1)+this.state.select_store_item+"&name="+name+"&before="+before+"&after="+after)
                .then(res=>{
                    message.success("删除成功")
                    let data=res.data.content;
                    let find_page_number=res.data.pageable.pageNumber+1
                    let find_totalElements=res.data.totalElements
                    let find_totalPages=res.data.totalPages
                    this.setState({
                        data_goods:data,
                        find_page_number,
                        find_totalElements,
                        find_totalPages
                    })
                })
            }
           
        },err=>{
            message.error("删除失败，请确认溯源秤是否绑定该商品")
        },()=>{
            message.error("删除失败，请确认溯源秤是否绑定该商品")      
        })
        }else{
            axios.delete('/api/rest/goods/'+this.state.delete_uuid)
            .then(res=>{
                axios.get('/api/rest/goods/?page='+(this.state.page_number-1)+'&size=10'+"&storeId="+this.state.select_store_item+"&name="+name+"&before="+before+"&after="+after)
                .then(res=>{
                    message.success("删除成功")
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_goods:data,
                        page_number,
                        totalElements,
                        totalPages
                    })
                })
            },(err)=>{
                message.error("删除失败，请确认溯源秤是否绑定该商品")
            })
            
        }
        
      }
      //删除框取消时候回调
      cancel=(e)=>{
        message.error('删除取消');
      }



    creategoods(){
        
        this.setState({
            add_visible:true,
            update_purchaseDate:moment()
        })
        if(["STORE_MANAGER","MARKET_MANAGER"].indexOf(this.state.role)>=0){
            axios.get('/api/rest/provider/list/?storeId='+this.state.uuid)
            .then(res=>{
                    this.setState({
                      // add_Select_provider:res.data.content[0].uuid,
                      data_provider:res.data,
                      provider_totalElements:res.data.totalElements,
                      provider_totalPages:res.data.totalPages,
                })
            })
        }else{
            axios.get('/api/rest/provider/list/?storeId='+this.state.select_store_item)
            .then(res=>{
                    this.setState({
                      // add_Select_provider:res.data.content[0].uuid,
                      data_provider:res.data,
                      provider_totalElements:res.data.totalElements,
                      provider_totalPages:res.data.totalPages,
                })
            })
        }
         
    }
    addTrue(){
        this.setState({
            addTrue:true
        },()=>{
            axios.get('/api/rest/goods/?page=0&size=10')
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber;
                this.setState({
                    data_goods:data
                })
            })
        })
    }
    handleChange(value) {
        this.setState({
            selectQuery:value
        })
      }
    handleUpdate=(e)=>{
        let value=e.target.value,
            name=e.target.name;
        this.setState({
            [name]:value
        })}
        
        //添加
        add_handleOk=()=>{
            let name=this.state.update_name,
                fullName=this.state.update_fullName,
                purchaseDates=this.state.update_purchaseDate,
                providerId=this.state.add_Select_provider,
                storeId=this.state.add_Select_store,
                remark=this.state.update_remark,
                sellOut=this.state.checked,
                date=Array.from(this.state.find_date),
                before=date.splice(0,1),
                after=date.splice(0,1),
                find_name=this.state.name||"",
                qty=this.state.update_qty;
                let purchaseDate
                purchaseDate = moment().format("YYYY-MM-DD")
                if(purchaseDates){
                    purchaseDate=purchaseDates.format("YYYY-MM-DD")
                }
            let readyData={
                name,
                fullName,
                purchaseDate,
                providerId,
                // storeId,
                remark,
                sellOut,
                qty,
                unit:"kg"
            }              
            axios.post('/api/rest/goods/',readyData,{headers: {
                'Content-Type': 'application/json;charset=utf-8'
              }})
            .then(res=>{
                message.success("添加成功")
                this.setState({
                    add_visible:false
                })
                if(this.state.role=="STORE_MANAGER"){
                    axios.get('/api/rest/goods/'+"?name="+find_name+"&before="+before+"&after="+after)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        update_name:" ",
                        update_fullName:" ",
                        update_purchaseDate:"",
                        add_Select_store:" ",
                        add_Select_provider:" ",
                        update_remark:" ",
                        add_select_provider_pagination:1,
                        add_select_store_pagination:1,
                        add_visible:false,
                        data_goods:data,
                        update_qty:"",
                        page_number,
                        totalElements,
                        totalPages
                    })
                })
                }else if (this.state.role=="MARKET_MANAGER"){
                    axios.get('/api/rest/goods/?storeId='+this.state.add_Select_store+"&name="+find_name+"&before="+before+"&after="+after)
                    .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            update_name:" ",
                            update_fullName:" ",
                            update_purchaseDate:moment(),
                            add_Select_store:" ",
                            add_Select_provider:" ",
                            update_remark:" ",
                            add_select_provider_pagination:1,
                            add_select_store_pagination:1,
                            add_visible:false,
                            data_goods:data,
                            update_qty:"",
                            page_number,
                            totalElements,
                            totalPages
                        })
                })
                }else{
                    axios.get('/api/rest/goods/?storeId='+this.state.select_store_item+"&name="+find_name+"&before="+before+"&after="+after)
                    .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            update_name:" ",
                            update_fullName:" ",
                            update_purchaseDate:"",
                            add_Select_store:" ",
                            add_Select_provider:" ",
                            update_qty:"",
                            update_remark:" ",
                            add_select_provider_pagination:1,
                            add_select_store_pagination:1,
                            add_visible:false,
                            data_goods:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                })
                }
                // axios.get('/api/rest/goods/')
                // .then(res=>{
                //     let data=res.data.content;
                //     let page_number=res.data.pageable.pageNumber+1
                //     let totalElements=res.data.totalElements
                //     let totalPages=res.data.totalPages
                //     this.setState({
                //         update_name:" ",
                //         update_fullName:" ",
                //         update_purchaseDate:"",
                //         add_Select_store:" ",
                //         add_Select_provider:" ",
                //         update_remark:" ",
                //         add_select_provider_pagination:1,
                //         add_select_store_pagination:1,
                //         add_visible:false,
                //         data_goods:data,
                //         page_number,
                //         totalElements,
                //         totalPages
                //     })
                // })
            },()=>{
                message.error('添加失败，请输入完整信息')
            })
        }
        add_handleCancel=()=>{
            this.setState({
                add_visible:false,
                 add_select_provider_pagination:1,
                add_select_store_pagination:1,
                update_purchaseDate:moment(),
            })
        }
        update_handleOk=()=>{
                let name=this.state.update_name||"",
                find_name=this.state.name||"",
                date=Array.from(this.state.find_date),
                before=date.splice(0,1),
                after=date.splice(0,1),
                fullname=this.state.update_fullName,
                purchaseDates=this.state.update_purchaseDate,
                qty=this.state.update_qty,
                remark=this.state.update_remark;
                let no=this.state.update_no;
                let uuid=this.state.update_uuid;
                let providerId=this.state.update_Select_provider,
                    storeId=this.state.update_Select_store,
                    goodsId=this.state.uuid,
                    purchaseDate=purchaseDates.format("YYYY-MM-DD")
            let readyData={
                name,
                fullName:fullname,
                purchaseDate,
                providerId,
                remark,
                qty,
                unit:"kg",
                sellOut:this.state.checked
            }              
            axios.put("/api/rest/goods/"+uuid,readyData)
            .then(res=>{
                message.success("编辑成功")
                if(["MARKET_MANAGER","ADMINISTRATOR"].indexOf(this.state.role)>=0){
                    axios.get('/api/rest/goods/?storeId='+this.state.STOREID+"&name="+find_name+"&before="+before+"&after="+after)
                    .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            update_name:" ",
                            update_fullName:" ",
                            update_purchaseDate:"",
                            update_remark:"",
                            update_no:"",
                            update_uuid:"",
                            update_Select_provider:"",
                            update_Select_store:"",
                            update_visible:false,
                            data_goods:data,
                            page_number,
                            totalElements,
                            totalPages,
                            add_select_provider_pagination:1,
                            add_select_store_pagination:1,
                        })
                    })
                }else{
                    axios.get('/api/rest/goods/?storeId='+this.state.STOREID+"&name="+find_name+"&before="+before+"&after="+after)
                    .then(res=>{
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            update_name:" ",
                            update_fullName:" ",
                            update_purchaseDate:"",
                            update_remark:"",
                            update_no:"",
                            update_uuid:"",
                            update_Select_provider:"",
                            update_Select_store:"",
                            update_visible:false,
                            data_goods:data,
                            page_number,
                            totalElements,
                            totalPages,
                            add_select_provider_pagination:1,
                            add_select_store_pagination:1,
                        })
                    })
                }
           
            }) 
        }
        update_handleCancel=()=>{
            this.setState({
                update_visible:false,
                add_select_provider_pagination:1,
                add_select_store_pagination:1,
                update_name:" ",
                update_fullName:" ",
                 update_remark:"",
                 update_purchaseDate:""
            })
        }
        find_date=(e,date)=>{
            
            this.setState({
                find_date:date,
                show_reset_picker:false
            })
        }
        changeUPIcon=()=>{
            this.setState({
                icon_up:!this.state.icon_up
            })
        }
        // add_Select=(e)=>{
        //     this.setState({
        //         add_store_select:e
        //     })
        // }
        add_Select_provider=(e)=>{
            this.setState({
                add_Select_provider:e
            })
        }
        add_Select_store=(e)=>{
            this.setState({
                add_Select_store:e
            },()=>{
                axios.get("/api/rest/provider/list?storeId="+e)
                .then(res=>{
                    this.setState({
                        data_provider:res.data
                    })
                })
            })
        }
        add_provider_pagination=(e)=>{
            this.setState({
                add_select_provider_pagination:e
            })
            axios.get('/api/rest/provider/?page='+(e-1))
          .then(res=>{
              let provider_totalElements=res.data.totalElements,
                  provider_totalPages=res.data.totalPages;
                  this.setState({
                    data_provider:res.data.content,
                    provider_totalElements,
                    provider_totalPages,
              })
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
        doReset=()=>{
            if(this.state.role=="STORE_MANAGER"){
                axios.get('/api/rest/goods/')
                .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let totalElements=res.data.totalElements
                let totalPages=res.data.totalPages
                this.setState({
                    name:"",
                    fullName:"",
                    find_name:"",
                    data_goods:data,
                    page_number,
                    totalElements,
                    totalPages,
                    find_date:[],
                    icon_up:false
                })
        })}else if(this.state.role=="MARKET_MANAGER"){
                axios.get('/api/rest/goods/?storeId='+this.state.select_store_item)
                .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let totalElements=res.data.totalElements
                let totalPages=res.data.totalPages
                this.setState({
                    name:"",
                    fullName:"",
                    find_name:"",
                    data_goods:data,
                    page_number,
                    totalElements,
                    totalPages,
                    find_date:[],
                    icon_up:false
                })
        })
        }else{
            axios.get('/api/rest/goods/?storeId='+this.state.select_store_item)
                .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let totalElements=res.data.totalElements
                let totalPages=res.data.totalPages
                this.setState({
                    name:"",
                    fullName:"",
                    find_name:"",
                    data_goods:data,
                    page_number,
                    totalElements,
                    totalPages,
                    find_date:[],
                    icon_up:false
                })
        })
        }
            
        }
        add_Select_provider=(e)=>{
            this.setState({
                add_Select_provider:e
            })
        }
        update_Select_store=(e)=>{
            this.setState({
                update_Select_store:e
            })
        }
        update_Select_provider=(e)=>{
            this.setState({
                update_Select_provider:e
            })
        }
        handleUpdateSelectStore=(e)=>{
            this.setState({
                select_store_item:e
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
    render(){
        return (
            <div id="page-wrapper">
            {/* <Spin spinning={this.state.loading}> */}
                <div style={{ background: '#ECECEC', padding: '30px' ,padding:"20px" }}>
                        <Card title="商品详情" bordered={false} style={{ width: "100%"}} >
                        
                        <span className="query" >商品名称:</span> 
                        <input type="text" name="name" class="form-control input" style={{marginRight:5}} placeholder="请输入商品名称" value={this.state.name} onChange={e=>this.inputFind(e)}/> 
                        
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
                            {
                                this.state.icon_up?
                                <i className="glyphicon glyphicon-chevron-up icon" onClick={()=>{this.changeUPIcon()}}></i>:
                                <i className="glyphicon glyphicon-chevron-down icon" onClick={()=>{this.changeUPIcon()}}></i>
                            }
                            
                            
                        </span>
                        
                        {
                            this.state.icon_up?
                            <div>
                                <span>查询日期：</span>
                                <RangePicker onChange={(e,date)=>{this.find_date(e,date)}} 
                                    locale={"locale"} style={{marginTop:15,marginLeft:5}}
                                    format={"YYYY-MM-DD"}
                                    
                                    placeholder={["开始日期",'结束日期']}/>
                            </div>
                            :null
                           
                        }
                       
                        <div><Button type="primary" className="add-btn" onClick={()=>this.creategoods()}><i className="fa fa-plus "></i>添加商品</Button></div>
                        
                        </Card>
                    </div>  
                <div class="form-group">
            </div>
                <div className="row">
                    <div className="col-md-12">
                    <Spin spinning={this.state.loading}>
                        <table className="table table-striped">   
                        
                            <thead>
                                <tr>
                                    <th>商品名称</th>
                                    <th>商品全称</th>
                                    <th>商品重量</th>
                                    <th>采购日期</th>
                                    <th>所属供应商</th>
                                    <th>是否售罄</th>
                                    <th>备注</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data_goods.map((value,index)=>{
                                    let sellOut=""
                                    if(value.sellOut.toString()=="true")  sellOut = "是"
                                    else if(value.sellOut.toString() == "false") sellOut = "否"
                                    else sellOut = "" 
                                        return (
                                            <tr name={index.toString()}>
                                                <td>{value.name}</td>
                                                <td>{value.fullName}</td>
                                                <td>{value.qty+value.unit}</td>
                                                <td>{value.purchaseDate}</td>
                                                <td>{value.provider.name}</td>
                                                <td>{sellOut}</td>
                                                <td >{value.remark}</td>
                                                <td>
                                                    <Button type="primary" style={{marginRight:15}}  onClick={(e)=>{this.doUpdate(e)}}>编辑</Button>
                                                    <Popconfirm title="确认删除 ？" onConfirm={this.confirm} onCancel={this.cancel} okText="确认" cancelText="取消">
                                                         <Button type="danger"  onClick={(e)=>{this.doDelete(e)}}>删除</Button>
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
                {
                    
                    <Pagination current={this.state.page_number} 
                                total={this.state.totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.changeNumber(pageNum)}}/>
                }

        <div>
        {
            
            <Modal
                title="编辑商品"
                okText="确定"
                cancelText="取消"
                visible={this.state.update_visible}
                onOk={this.update_handleOk}
                onCancel={this.update_handleCancel}
                >
            <div>
                <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >商品名称：</Col>
                    <Col span={15}><Input type="text" value={this.state.update_name} name="update_name" onChange={e=>{this.handleUpdate(e)}}/></Col>
                </Row>
                <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >商品全称：</Col>
                    <Col span={15}><Input type="text" value={this.state.update_fullName} name="update_fullName" onChange={e=>{this.handleUpdate(e)}}/></Col>
                </Row>
                <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >商品重量：</Col>
                    <Col span={14}><Input type="text" value={this.state.update_qty} name="update_qty" onChange={e=>{this.handleUpdate(e)}}/></Col>
                    <Col span={1}   >{this.state.update_unit}</Col>
                </Row>
                <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >采购日期：</Col>
                    <Col span={15}><DatePicker  value={moment(this.state.update_purchaseDate, "YYYY-MM-DD")} format="YYYY-MM-DD"style={{borderRadius:"2px",borderColor:"rgb(205,205,205)",width: 296 }} onChange={(date,DATA)=>this.onChangeUpdateDate(date,DATA)}/></Col>
                </Row>
                <Row type="flex" className="add_modal" justify="start">
                 <Col span={5}  >供货商名称 :</Col>
                 <Col span={15}>
                    <Select  
                            showSearch
                            style={{ width: 296 }} 
                            filterOption={(input,option)=>option.props.children.indexOf(input)>=0}
                            onChange={(e)=>{this.update_Select_provider(e)}} 
                            value={this.state.update_Select_provider}>
                        {
                            this.state.data_provider.map((value,index)=>{
                            return (
                                <Option value={value.uuid} key={index}>{value.name}</Option>
                            )
                        })
                        } 
                    </Select>
                </Col>
                </Row>
                {/* <Row type="flex" className="add_modal" justify="start">
                 <Col span={5}  >商铺名称 :</Col>
                 <Col span={15}>
                    <Select  style={{ width: 182 }} onChange={(e)=>{this.update_Select_store(e)}} value={this.state.update_Select_store}>
                        {
                            this.state.data_store.map((value,index)=>{
                            return (
                                <Option value={value.uuid} key={index}>{value.name}</Option>
                            )
                        })
                        } 
                    </Select>
                    <Pagination current={this.state.add_select_store_pagination} total={this.state.store_totalElements} onChange={(e)=>{this.add_store_pagination(e)}}style={{marginTop:10}}/>
                    
                </Col>
             </Row> */}
             <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >是否售罄：</Col>
                    <Col span={15}>
                    <RadioGroup name="radiogroup" value={this.state.checked} onChange={e=>{this.setState({checked:e.target.value});
                    }} >
                        <Radio value={true} >是</Radio>
                        <Radio value={false} >否</Radio>
                    </RadioGroup>
                        
                        </Col>
                </Row>
                <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >备注：</Col>
                    <Col span={15}><Input type="text" value={this.state.update_remark}  name="update_remark" onChange={e=>{this.handleUpdate(e)}}/></Col>
                </Row>
            </div>
                </Modal>
        }
        
        {
            
            <Modal
                title="添加商品"
                okText="确定"
                cancelText="取消"
                visible={this.state.add_visible}
                onOk={this.add_handleOk}
                onCancel={this.add_handleCancel}
                >
            <div>
                <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >商品名称：</Col>
                    <Col span={15}><Input type="text" value={this.state.update_name}   name="update_name" onChange={e=>{this.handleUpdate(e)}}/></Col>
                </Row>
                <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >商品全称：</Col>
                    <Col span={15}><Input type="text" value={this.state.update_fullName} name="update_fullName" onChange={e=>{this.handleUpdate(e)}}/></Col>
                </Row>
                <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >商品重量：</Col>
                    <Col span={14}><Input type="text" value={this.state.update_qty} name="update_qty" onChange={e=>{this.handleUpdate(e)}}/></Col>
                    <Col span={1}   >kg</Col>
                </Row>
                <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >采购日期：</Col>
                    <Col span={15}><DatePicker  style={{ width: 296 }} value={this.state.update_purchaseDate} format="YYYY-MM-DD"  onChange={(date,DATA)=>this.onChangeUpdateDate(date,DATA)}/></Col>
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
                <Row type="flex" className="add_modal" justify="start">
                 <Col span={5}  >供货商名称 :</Col>
                 <Col span={15}>
                    <Select  style={{ width: 296}} onChange={(e)=>{this.add_Select_provider(e)}} value={this.state.add_Select_provider}>
                        {
                            this.state.data_provider.map((value,index)=>{
                            return (
                                <Option value={value.uuid} key={index}>{value.name}</Option>
                            )
                        })
                        } 
                    </Select>
                </Col>
                </Row>
                {/* <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >是否售罄：</Col>
                    <Col span={15}>
                    <RadioGroup name="radiogroup" value={this.state.checked} onChange={e=>{this.setState({checked:e.target.value});
                    }} >
                        <Radio value={true} >是</Radio>
                        <Radio value={false} >否</Radio>
                    </RadioGroup>
                        
                        </Col>
                </Row> */}
                <Row type="flex" className="add_modal" justify="start" >
                    <Col span={5}   >备注：</Col>
                    <Col span={15}><Input type="text" value={this.state.update_remark}  name="update_remark" onChange={e=>{this.handleUpdate(e)}}/></Col>
                </Row>
            </div>
                </Modal>
        }
        </div>
        {/* </Spin> */}
            </div>
        )
    }
}