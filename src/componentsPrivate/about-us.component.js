import { Link } from "react-router-dom"
import React, { Component } from "react";

export default class AboutUs extends Component{
    constructor(props) {
        super(props);
        this.state = {
            login: false,
            signip: false
        }}

    render(){
        return(
            <div className="auth-inner-table" >
                <div>
                    <h1>DesignMatch</h1>
                </div>
                <div>
                    <p>Si estas buscando un diseño personalizado para tu empresa, 
                        estas en el sitio adecuado! Nuestra empresa DesignMatch, 
                        es una plataforma SaaS, que le brinda la oportunidad a sus clientes de publicar ofertas de proyectos que requieren de algún tipo de diseño. 
                        De la misma manera le proveemos el espacio y las herramientas a los diseñadores para que estos puedan subir sus propuestas y en caso de ser elegidas, 
                        obtener una remuneración por estas.
                    </p>
                </div>
                <div>
                    <Link className= "btn btn-primary btn-block" to={"/sign-in"}>Login</Link>
                    <Link className="btn btn-primary btn-block" to={"/api-auth"}>SignUp</Link>
                </div>
            </div>
        );
    }
}