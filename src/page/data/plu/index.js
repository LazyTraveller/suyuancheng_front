
import React,{Component} from 'react'
import PageTitle from '../../../component/page'
import Pagination from 'rc-pagination';
import axios from 'axios'
import "antd/dist/antd.css";
import { Modal, Button,Popconfirm, message,Select,Row,Col ,Card,Input} from 'antd';
import Alert from '../../../component/alert'
import '../index.css'
import 'rc-pagination/dist/rc-pagination.min.css'
import util from '../../../util/fun'
import Add from '../../../component/add/add_market.js'
const Option = Select.Option;
export default class Plu extends Component{
    constructor(props){
        super(props);
        this.state={
            data_plu:[],//获取到的数据dawdawd
            page_number:0,
            data_goods:[],
            totalElements:1,
            totalPages:1,//数据页面
            find_name:"",
            find_pagination:true,
            find_page_number:0,
            find_totalElements:1,
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
            selectQuery:"goodsId",
            add_true:false,    
            suyuanchengId:"",
            delete_goodsId:"",
            query_marketId:"",
            find_goodsname:"",
            page_number:1,
            totalElements:1,
            totalPages:1
            }
    }
    componentDidMount(){
        let suyuanchengId=this.props.match.params.id
        axios.get('/api/rest/plu/?suYuanChengId='+suyuanchengId+"&page=0")
        .then(res=>{
            if(res.status!=200){
                this.props.history.push('/login')
            }
            let data=res.data.content;
            let totalElements=res.data.totalElements
            let totalPages=res.data.totalPages
            this.setState({
                data_plu:data,
                totalElements,
                totalPages,
                suyuanchengId
            })
        },()=>{
            this.props.history.push('/login')
        })
        axios.get('/api/rest/goods/list')
            .then(res=>{
                let data=res.data;
                this.setState({
                    data_goods:data,
                })
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
            axios.get('/api/rest/plu/?page='+(pageNum-1)+"&suYuanChengId="+this.props.match.params.id+"&code="+this.state.find_name+"&goodsName="+this.state.find_goodsname)
            .then(res=>{
                
                
                let data=res.data.content;
                this.setState({
                    data_plu:data
                })
            })
        })}
    //搜索功能
    doFind(){
        let value=this.state.find_name||"";
        let goodsName=this.state.find_goodsname||"";
        let suYuanChengId=this.props.match.params.id
            axios.get('/api/rest/plu/?code='+value+"&goodsName="+goodsName+"&suYuanChengId="+suYuanChengId)
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber+1
                let totalElements=res.data.totalElements
                this.setState({
                    data_plu:data,
                    page_number,
                    totalElements,
                })
            },err=>{
                message.error("请输入数字进行查询")
            })
    }




    //编辑更新数据
    doUpdate(e){
        let value=e.target.parentNode.parentNode;
        let no=value.getAttribute("name");
        let uuid=this.props.match.params.id;
        let goodsId=this.state.data_plu[no].goods.uuid;
        let code=value.childNodes[1].innerText;
        let price=value.childNodes[2].innerText;
        this.setState({
            visible: true,
            update_goodsId:goodsId,
            update_code:code,
            update_uuid:uuid,
            update_price:price,
            update_no:no,
            find_pagination:false
          });
    }
    //编辑框弹出框点击成功回调
    handleOk = (e) => {
        let suyuanchengdata=this.props.match.params.id
        let goodsId=this.state.data_plu[this.state.update_no].id.goodsId;
        let readyData={
            price:this.state.update_price,
            code:this.state.update_code
        }
            
            axios.put('/api/rest/plu/'+suyuanchengdata+'/'+goodsId,readyData)
            .then(res=>{
                message.success("更新成功")
                let {code,price}=res.data
                this.state.data_plu[this.state.update_no].price=price;
                this.state.data_plu[this.state.update_no].code=code;
                this.setState({
                    visible: false,
                    update_goodsId:goodsId,
                    update_price:price,
                    update_code:code,
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
        let no=value.getAttribute("name");
        let uuid=value.childNodes[0].innerText;
        let goodsId=this.state.data_plu[no].goods.uuid
        let storeId=this.state.data_plu[no].suYuanCheng.store.uuid
        this.setState({
            delete_uuid:uuid,
            delete_goodsId:goodsId,
            delete_storeId:storeId
        })  
    }
    //删除框确认时候回调
    confirm=(e)=>{
        axios.delete('/api/rest/plu/'+this.props.match.params.id+'/'+this.state.delete_goodsId)
        .then(res=>{
                this.state.data_plu.length--;
                if(this.state.data_plu.length<=0){
                    this.setState({
                        page_number:this.state.page_number-1
                    },()=>{
                        if(this.state.role=="STORE_MANAGER"){
                        axios.get('/api/rest/plu/?page='+(this.state.page_number-1)+'&size=10')
                        .then(res=>{
                            message.success("删除成功")
                            let data=res.data.content;
                            let page_number=res.data.pageable.pageNumber+1
                            let totalElements=res.data.totalElements
                            let totalPages=res.data.totalPages
                            this.setState({
                                data_plu:data,
                                page_number,
                                totalElements,
                                totalPages
                            })
                        })
                    }else{
                        axios.get('/api/rest/plu/?page='+(this.state.page_number-1)+'&suYuanChengId='+this.props.match.params.id)
                        .then(res=>{
                            message.success("删除成功")
                            let data=res.data.content;
                            let page_number=res.data.pageable.pageNumber+1
                            let totalElements=res.data.totalElements
                            let totalPages=res.data.totalPages
                            this.setState({
                                data_plu:data,
                                page_number,
                                totalElements,
                                totalPages
                            })
                        })
                    }
                })   
                }else{
                    if(this.state.role=="STORE_MANAGER"){
                    axios.get('/api/rest/plu/?page='+(this.state.page_number-1)+'&size=10')
                    .then(res=>{
                        message.success("删除成功")
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_plu:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                    })
                }else{
                    axios.get('/api/rest/plu/?page='+(this.state.page_number-1)+'&suYuanChengId='+this.props.match.params.id)
                    .then(res=>{
                        message.success("删除成功")
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_plu:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                    })
                }
            }
        }
           
        ,err=>{
            new Error(err)
        })
        
        
      }
      //删除框取消时候回调
      cancel=(e)=>{
        message.error('删除失败');
      }


      doReset=()=>{
          this.setState({
              find_name:"",
              find_goodsname:""
          })
          let suyuanchengId=this.props.match.params.id
        axios.get('/api/rest/plu/?suYuanChengId='+suyuanchengId)
        .then(res=>{
            let data=res.data.content;

            let page_number=res.data.pageable.pageNumber+1
            let totalElements=res.data.totalElements
            let totalPages=res.data.totalPages
            this.setState({
                data_plu:data,
                page_number,
                totalElements,
                totalPages,
                suyuanchengId
            })
        })
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
                    data_plu:data
                })
            })
        })
    }
      handleChange=(e)=>{
        this.setState({
            query_marketId:e
        })
    }
    inputFind=e=>{
        this.setState({
            find_name:e.target.value
        })
    }
    inputFindGodds=e=>{
        this.setState({
            find_goodsname:e.target.value
        })
    }
    render(){
        return (
            <div id="page-wrapper">
            <div style={{background:"#ececec",padding:"30px",padding:"20px"}}>
                    <Card title="PLU编码详情" border={false} style={{width:"100%",padding:"24 41"}}>
                        <div>
                            <span className="query">PLU编码 ：</span>
                            <input type="text" className="form-control input" placeholder="请输入PLU编码" value={this.state.find_name} onChange={e=>this.inputFind(e)}/>
                            <span className="query" style={{marginLeft:63}}>商品名称:</span>  
                            <input type="text" className="form-control input" placeholder="请输入商品名称" value={this.state.find_goodsname} onChange={e=>this.inputFindGodds(e)}/>
                            <span className="action">
                                <Button className="query-btn" type="primary" onClick={()=>this.doFind()}>查询</Button>
                                <Button className="query-btn" onClick={()=>this.doReset()}>重置</Button>
                            </span>
                        </div>
                        {/* <div><Button  className="add-btn" onClick={()=>this.createMarket()}><i className="fa fa-plus "></i>添加商铺管理员</Button></div> */}
                    </Card>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <table className="table table-striped">   
                            <thead>
                                <tr>
                                    {/* <th>溯源秤机器码</th> */}
                                    <th>商品名称</th>
                                    <th>PLU编码</th>
                                    
                                    <th>价格</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data_plu.map((value,index)=>{
                                        return (
                                            <tr name={index.toString()}>
                                                {/* <td>{this.props.match.params.id}</td> */}
                                                <td>{value.goods.name}</td>
                                                <td>{value.code}</td>
                                                <td>{value.price}</td>
                                                <td><Button type="primary" className="btn" onClick={(e)=>{this.doUpdate(e)}}>编辑</Button>
                                                    <Popconfirm title="确认删除 ？" onConfirm={this.confirm} onCancel={this.cancel} okText="Yes" cancelText="No">
                                                         <Button type="primary" className="btn" onClick={(e)=>{this.doDelete(e)}}>删除</Button>
                                                    </Popconfirm>
                                                </td>
                                            </tr> 
                                        )
                                    })
                                }
                            </tbody>
                        </table> 
                    </div>
                </div>
                
                <Pagination current={this.state.page_number} 
                                total={this.state.totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.changeNumber(pageNum)}}/>

{/* 
                                <Pagination     current={this.state.page_number} 
                                total={this.state.find_totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.changeNumber(pageNum)}}/> */}

        <div>
        {this.state.visible?<Modal
          title="编辑PLU"
          okText="确定"
          cancelText="取消"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            <tr>
                <td><span>PLU编码 ：</span><input type="text" class="form-control input update" name="update_code" defaultValue={this.state.update_code} onChange={e=>{this.handleUpdate(e)}}/></td>
              
                <td><span>价格 ： </span><input type="text" class="form-control input update"  name="update_price" defaultValue={this.state.update_price} onChange={e=>{this.handleUpdate(e)}}/></td>
            </tr> 
        </Modal>:null}
        {
            this.state.add_visible?<Add visible={this.state.add_visible} title="添加市场" url="/api/rest/market/" config="address" createMarketChangeVisible={this.createMarketChangeVisible.bind(this)} addTrue={this.addTrue.bind(this)}/>:null
        }
        </div>
            </div>
        )
    }
}