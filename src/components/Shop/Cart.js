import React, { Component } from 'react';
import axios from 'axios';
import Items from './Items';
import {Link} from 'react-router-dom';



class Cart extends Component{
    constructor(){
        super()
        this.state={
            userCart:[],
            details:[],
            currentUser:{},
            userId:null,
            products:[]
        }


    }
    componentDidMount(){
        axios.get("/api/current_user")
        .then(response => {
            if(response.data[0].id){
                console.log(response.data[0].id)
                this.setState({
                    currentUser: response.data[0],
                    userId: response.data[0].id
                })
            }
        })
        .catch();
        axios.get('/api/cart').then(items=>{
            console.log(items.data)
            this.setState({
                products:items.data
            })
        })
        this.getCartDetails();
    }
    getCartDetails=()=>{
                axios.get('/api/details').then(cart =>{
                    console.log(cart.data)
                    this.setState({
                        details:cart.data
                    })
                })

    }

    handleAddItem=(id, quantity)=>{

        console.log('ADDITEM',quantity)
            axios.put(`/api/cart/${id}/${quantity}`).then((res)=>{
            console.log(res.data)
            this.setState({
                details:res.data
            })
        })
    }
    handleDeleteItem=()=>{
        const {id} = this.props
        console.log('DELETEITEM',id)
        axios.put('/api/delete',{id}).then(res=>{
            console.log(res.data)
                axios.get('/api/details').then(updatedCart=>{
                    this.setState({
                        details:updatedCart
                    })
                    
                })
            })
    }
    handleDeleteProduct=(id)=>{
        axios.delete(`/api/product/${+id}`,).then(res=>{
            console.log(res.data)
                this.setState({
                    details:res.data
                })
            })
    }

    render(){
      let total = this.state.details.reduce((acc,product)=>{
        let cost = (Number(product.product_price.replace(/[$]+/g, '')*product.quantity))
        return (acc + cost)
      }, 0);
        
        let items =  this.state.details.map(e=>{
            return(
                <Items
                    id={e.product_id}
                    key={e.product_id}
                    quantity={e.quantity}
                    name={e.product_name}
                    price={e.product_price}
                    image={e.product_image}
                    description={e.product_description}
                    delete={this.handleDeleteItem}
                    add={this.handleAddItem}
                    deleteProduct={this.handleDeleteProduct}
                />
            )
        })
      

        return(
                <div className='cart-main'>
                    <h1>Cart</h1>
                <div className='shop-items'>
                  {items}
                
                    <h1>Total:${total.toFixed(2)}</h1>
                </div>
                  
                  <Link to='/store'><button>STORE</button></Link>
                    
                </div>

            )

    }
}
export default Cart;