
import React,{Component} from 'react'
import PageTitle from '../../../component/page'
import Pagination from 'rc-pagination';
import axios from 'axios'
import "antd/dist/antd.css";
import moment from 'moment'
import{Link} from 'react-router-dom'
import { Modal, Button,Popconfirm, message,Select ,DatePicker,Card,Input,Spin } from 'antd';
import Alert from '../../../component/alert'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import 'rc-pagination/dist/rc-pagination.min.css'
import util from '../../../util/fun'
import Add from '../../../component/add/add_market.js'
import fun from '../../../component/select/index'
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export default class Trading extends Component{
    constructor(props){
        super(props);
        this.state={
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
            update_remark:"",
            update_marketId:"",
            update_no:"",
            delete_uuid:"",//删除的数据的key 
            delete_no_find:"",
            params:'',
            add_visible:false,
            selectQuery:"storeName",
            add_true:false,    
            before:"",
            after:"",
            find_sequence:"",
            icon_up:true,
            find_date:[],
            uuid:"",
            role:"",
            loading:true,
            select_store_item:"",
            select_store:[],
            select_market_item:"",
            select_market:[]
            }
    }
    componentDidMount(){
    axios.get('/api/rest/user/user-info')
    .then(res=>{
        if(res.status!=200){
            this.props.history.push('/login')
        }
        if(fun.select(res.data.roles)=="STORE_MANAGER"){
            this.setState({
                uuid:res.data.store.uuid,
                role:fun.select(res.data.roles)
            })
            axios.get('/api/rest/trading/?page=0&size=10')
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
                    loading:false
                })
            })
        }else if(fun.select(res.data.roles)=="MARKET_MANAGER"){
            this.setState({
                uuid:res.data.market.uuid,
                role:fun.select(res.data.roles)
            },()=>{
                axios.get('/api/rest/store/list?marketId='+res.data.market.uuid)
                .then(res=>{
                    this.setState({
                        select_store:res.data,
                        loading:false,
                    },()=>{
                        if(this.state.select_store.length<=0){

                        }else{
                            this.setState({
                                select_store_item:res.data[0].uuid,
                                RESET:res.data[0].uuid,
                            },()=>{
                                axios.get('/api/rest/trading/?storeId='+res.data[0].uuid)
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
                                    find_name:"",
                                    select_store_item:this.state.select_store[0].uuid,
                                    loading:false,
                                })
                            })
                            })
                        }
                    })
                   
                })
            })
        }else{
            axios.get('/api/rest/market/list')
            .then(res=>{
                this.setState({
                    select_market:res.data,
                    loading:false,
                   
                },()=>{
                    if(this.state.select_market.length<=0){

                    }else{
                        this.setState({
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
                                        axios.get('/api/rest/trading/?page=0&size=10&storeId='+this.state.select_store_item)
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
                                                find_name:"",
                                                select_store_item:this.state.select_store[0].uuid,
                                                loading:false,
                                            })
                                        })
                                        })
                                        
                                    }
                                    
                                })
                        })
                        })
                    }
                   
            })
        })

            this.setState({
                role:fun.select(res.data.roles)
            })
        }
        // axios.get('/api/rest/trading/?page=0&size=10')
        // .then(res=>{
        //     let data=res.data.content;
        //     let page_number=res.data.pageable.pageNumber+1
        //     let totalElements=res.data.totalElements
        //     let totalPages=res.data.totalPages
        //     this.setState({
        //         data_store:data,
        //         page_number,
        //         totalElements,
        //         totalPages,
        //         loading:false
        //     })
        // })
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

      handleUpdateSelectMarket=(e)=>{
        this.setState({
            select_market_item:e
        })
        axios.get('/api/rest/store/list/?marketId='+e)
        .then(res=>{
            this.setState({
                select_store:res.data,
                loading:false,
            })
        }) 
    }
    //分页导航
    changeUPIcon=()=>{
        this.setState({
            icon_up:!this.state.icon_up
        })
    }
    // changeNumber(pageNum){
    //     this.setState({
    //         page_number:pageNum,
    //     },()=>{
    //         if(this.state.role=="STORE_MANAGER"){
    //             axios.get('/api/rest/trading/?page='+(pageNum-1))
    //             .then(res=>{
    //                 let data=res.data.content;
    //                 this.setState({
    //                     data_store:data
    //                 })
    //             })
    //         }else{
    //             axios.get('/api/rest/trading/?page='+(pageNum-1)+"&storeId="+this.state.select_store_item)
    //             .then(res=>{
    //                 let data=res.data.content;
    //                 this.setState({
    //                     data_store:data
    //                 })
    //             })
    //         }
           
    //     })}
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
                    axios.get('/api/rest/goods/?page='+(pageNum-1)+"&sequence="+name+"&before="+before+"&after="+after)
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
                    axios.get('/api/rest/goods/?page='+(pageNum-1)+"&storeId="+this.state.select_store_item+"&sequence="+name+"&before="+before+"&after="+after)
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
        let date=Array.from(this.state.find_date)
        
        let before=moment(date[0]).format('YYYY-MM-DDTHH:mm:ss');
        let after=moment(date[1]).format('YYYY-MM-DDTHH:mm:ss');
        let name=this.state.find_name,
            sequence=this.state.find_sequence;
            
        let queryQue=""
        if(date.length<=0){
            before="";
            after=""
        }
        if(["MARKET_MANAGER","ADMINISTRATOR"].indexOf(this.state.role)>=0){
            queryQue=this.state.select_store_item
            
                axios.get(`/api/rest/trading/?storeName=${name}&before=${before}&after=${after}&sequence=${sequence}&storeId=${queryQue}`)
                .then(res=>{
                    let data=res.data.content;
                    let page_number=res.data.pageable.pageNumber+1
                    let totalElements=res.data.totalElements
                    let totalPages=res.data.totalPages
                    this.setState({
                        data_store:data,
                        page_number,
                        totalElements,
                        pagination:true
                    })
                })
            } 
        if(this.state.role=="STORE_MANAGER"){
        
            axios.get(`/api/rest/trading/?before=${before}&after=${after}&sequence=${sequence}&storeName=${name}`)
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let totalElements=res.data.totalElements
                let totalPages=res.data.totalPages
                this.setState({
                    data_store:data,
                    page_number,
                    totalElements,
                    pagination:true
                })
            })
        }

    }




    //编辑更新数据
    doUpdate(e){
        let value=e.target.parentNode.parentNode;
        let no=value.getAttribute("name");
        let uuid=value.childNodes[0].innerText;
        let name=value.childNodes[1].innerText;
        let marketId=value.childNodes[2].innerText;
        let remark=value.childNodes[3].innerText;
        this.setState({
            visible: true,
            update_name:name,
            update_marketId:marketId,
            update_uuid:uuid,
            update_remark:remark,
            update_no:no,
            find_pagination:false
          });
    }
    //编辑框弹出框点击成功回调
    handleOk = (e) => {
        let data=this.state.data_store[this.state.update_no];
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
            axios.put('/api/rest/store/'+data.uuid,readyData)
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
      handleUpdateSelectStore=(e)=>{
        this.setState({
            select_store_item:e
        })
    }






    //删除按钮
    doDelete(e){
        let value=e.target.parentNode.parentNode;
        let name=value.getAttribute("name");
        let uuid=value.childNodes[0].innerText;
        this.setState({
            delete_no:name,
            delete_uuid:uuid,
            find_pagination:false
        })  
    }
    //删除框确认时候回调
    confirm=(e)=>{
        axios.delete('/api/rest/store/'+this.state.delete_uuid)
        .then(res=>{
            if(this.state.find_pagination){
                axios.get('/api/rest/store/?page='+(this.state.find_page_number-1)+'&'+this.state.selectQuery+'='+this.state.find_name)
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
                        axios.get('/api/rest/store/?page='+(this.state.page_number-1)+'&size=10')
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
                    axios.get('/api/rest/store/?page='+(this.state.page_number-1)+'&size=10')
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
           
        },err=>{
            new Error(err)
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
      add_handleOk=()=>{
        let suYuanChengId=this.state.update_suYuanChengId,
            sequence=this.state.update_sequence,
            amount=this.state.update_amount,
            time=moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS"),
            header={
                headers:{
                    'Content-Type':"Application/json;charset=utf-8"
                }
            }
        let readyData={
            suYuanChengId,
            sequence,
            amount,
            time
        }
            axios.post('/api/rest/trading/',readyData,header)
            .then(res=>{
                message.success('添加成功')
                this.setState({
                    add_visible:false
                },()=>{
                    axios.get('/api/rest/trading/?page'+(this.state.pageNum-1))
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
            },()=>{
                message.error('添加失败')
            })
      }
      add_handleCancel=()=>{
          this.setState({
              add_visible:false
          })
      }
      inputFindSeq=(e)=>{
          this.setState({
              find_sequence:e.target.value
          })
      }
      changDate=(e,value)=>{
        let find_date=value
        this.setState({
            find_date
        })
      }
      doReset=()=>{
          if(this.state.role=="STORE_MANAGER"){
            axios.get('/api/rest/trading/?page=0&size=10')
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
                    find_name:"",
                    find_sequence:"",
                    icon_up:true,
                    find_date:[]
                })
            })
          }else{
            axios.get('/api/rest/trading/?storeId='+this.state.select_store_item)
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
                    find_name:"",
                    find_sequence:"",
                    icon_up:true,
                    find_date:[]
                })
            })
          }
        
      }
      find_date=(e,date)=>{
        this.setState({
            find_date:date,
            show_reset_picker:false
        })
    }
    render(){
        return (
            <div id="page-wrapper">
            
            <div style={{ background: '#ECECEC', padding: '30px' ,padding:"20px" }}>
                        <Card title="交易详情" bordered={false} style={{ width: "100%"}}style={{marginRight:63}} >
                        <span className="query">交易流水号:</span>  
                        <input type="text" class="form-control input"  style={{marginRight:5}} placeholder="请输入交易流水号" value={this.state.find_sequence } onChange={e=>this.inputFindSeq(e)}/> 
                        {/* {this.state.role==="STORE_MANAGER"? null:
                            <span >
                                {
                                    this.state.role=="ADMINISTRATOR"?<Select 
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
                                    </span>
                                    :null
                                
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
                                <i className="glyphicon glyphicon-chevron-down icon" onClick={()=>{this.changeUPIcon()}}></i>:
                                <i className="glyphicon glyphicon-chevron-up icon" onClick={()=>{this.changeUPIcon()}}></i>
                            }
                            
                            
                        </span>
                        {
                            this.state.icon_up?null:
                            <div>
                                <span>查询日期：</span>
                                <RangePicker onChange={(e,date)=>{this.find_date(e,date)}} 
                                    locale={"locale"} style={{marginTop:15,marginLeft:5}}
                                    format={"YYYY-MM-DD"}
                                    
                                    placeholder={["开始日期",'结束日期']}/>
                            </div>
                           
                           
                        }
                       
                        {/* <div><Button type="primary" className="add-btn" onClick={()=>this.creategoods()}><i className="fa fa-plus "></i>添加商品</Button></div> */}
                        </Card>
                    </div>



                
                <div className="row">
                    <div className="col-md-12">
                    <Spin spinning={this.state.loading} >
                        <table className="table table-striped">   
                            <thead>
                                <tr>
                                    {/* {
                                        this.state.role==="STORE_MANAGER"?null:<th>店铺名称</th>
                                    } */}
                                    
                                    <th>溯源秤编号</th>
                                    <th>交易流水号</th>
                                    
                                    <th>总金额</th>
                                   
                                    <th>交易时间</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data_store.map((value,index)=>{
                                        return (
                                            <tr name={index.toString()}>
                                                {/* {
                                                    this.state.role==="STORE_MANAGER"?null:
                                                    <td>{value.suYuanCheng.store.name}</td>
                                                } */}
                                                
                                                <td>{value.suYuanCheng.machineId}</td>
                                                <td>{value.sequence}</td>
                                                <td>{value.amount}</td>
                                                <td>{value.time}</td>
                                                <td><Button><Link key={index} name={value.uuid} to={'/info/trading-item/'+value.uuid}>查看交易项</Link></Button></td>
                                                {/* <td><Button type="primary" className="btn" onClick={(e)=>{this.doUpdate(e)}}>编辑</Button>
                                                    <Popconfirm title="确认删除 ？" onConfirm={this.confirm} onCancel={this.cancel} okText="Yes" cancelText="No">
                                                         <Button type="primary" className="btn" onClick={(e)=>{this.doDelete(e)}}>删除</Button>
                                                    </Popconfirm>
                                                </td> */}
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
        {this.state.visible?<Modal
          title="编辑交易"
          okText="确定"
          cancelText="取消"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            <tr>
            <span style={{width:85}}>名称：<input type="text"  class="form-control input update" name="update_name" defaultValue={this.state.update_name} onChange={e=>{this.handleUpdate(e)}}/></span>
            <span style={{width:85,marginLeft:15}}>所属市场：<input type="text" style={{width:85}} class="form-control input update" name="update_marketId" defaultValue={this.state.update_marketId} onChange={e=>{this.handleUpdate(e)}}/></span>
            <span style={{width:85,marginLeft:15}}>备注：<input type="text" style={{width:85}} class="form-control input update"  name="update_remark" defaultValue={this.state.update_remark} onChange={e=>{this.handleUpdate(e)}}/></span>            </tr> 
        </Modal>:null}
        <Modal
          title="编辑交易"
          okText="确定"
          cancelText="取消"
          width="650px"
          visible={this.state.add_visible}
          onOk={this.add_handleOk}
          onCancel={this.add_handleCancel}
        >
            <tr>
            <span style={{width:85}}>溯源秤ID ： <input type="text"  class="form-control input update" name="update_suYuanChengId" defaultValue={this.state.update_name} onChange={e=>{this.handleUpdate(e)}}/></span>
            <span style={{width:85,marginLeft:15}}>sequence ：<input type="text" style={{width:85}} class="form-control input update" name="update_sequence"  onChange={e=>{this.handleUpdate(e)}}/></span>
            <span style={{width:85,marginLeft:15}}>amount : <input type="text" style={{width:85}} class="form-control input update"  name="update_amount"  onChange={e=>{this.handleUpdate(e)}}/></span>            </tr> 
        </Modal>
        </div>
            </div>
        )
    }
}