import { Link, Redirect, withRouter } from "react-router-dom"
import Axios from "axios"
import React, { Component } from "react";

class AddDesign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            design: {
                designer_name: "",
                designer_lastname: "",
                designer_email: "",
                desing_original: "",
                design_price: "",
            },
            companyId: this.props.match.params.companyId,
            projectId: this.props.match.params.projectId,
            isSubmitted: false,
            showErrorBox: false,
            errorsContent: [],
        }
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = name !== "desing_original" ? target.value : target.files[0];

        var designData = this.state.design;
        designData[name] = value;
        this.setState({
            design: designData
        });
    }

    handleSubmit(event) {
        event.preventDefault()
        var designData = new FormData();
        Object.keys(this.state.design).map((key) => {
            designData.append(key, this.state.design[key]);
        });

        Axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/${this.state.companyId}/projects/${this.state.projectId}/designs/`,
            designData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
            .then(res => {
                this.setState({
                    isSubmitted: true
                })
            })
            .catch(err => {
                if (err.response) {
                    var error_log = [];
                    Object.keys(err.response.data).map((key) => {
                        err.response.data[key].forEach(val => {
                            error_log.push(val);
                        })
                    })

                    this.setState({
                        errorsContent: error_log,
                        showErrorBox: true,
                    })
                } else {
                    this.setState({
                        errorsContent: ['No se pudo crear el diseño. Por favor intentelo mas tarde'],
                        showErrorBox: true,
                    })
                }
                console.log(err)
            })
    }

    drawForm() {
        return (
            <form onSubmit={(event) => this.handleSubmit(event)}>
                <h1>Información de tu Diseño</h1>

                <div className="form-group">
                    <label>Archivo</label>
                    <input type="file" name="desing_original" className="form-control" onChange={(event) => this.handleChange(event)} />
                </div>

                <div className="form-group">
                    <label>Precio del diseño</label>
                    <input type="number" name="design_price" min="0" step="1" className="form-control" value={this.state.design.design_price} onChange={(event) => this.handleChange(event)} />
                </div>

                <h1>Datos de contacto</h1>

                <div className="form-group">
                    <label>Tu nombre</label>
                    <input type="text" name="designer_name" className="form-control" onChange={(event) => this.handleChange(event)} />
                </div>

                <div className="form-group">
                    <label>Tu apellido</label>
                    <input type="text" name="designer_lastname" className="form-control" onChange={(event) => this.handleChange(event)} />
                </div>

                <div className="form-group">
                    <label>Tu correo</label>
                    <input type="email" name="designer_email" className="form-control" onChange={(event) => this.handleChange(event)} />
                </div>

                {this.renderErrors()}

                <button type="submit" className="btn btn-primary btn-block">Enviar Diseño</button>
            </form>
        )
    }

    renderErrors() {
        if (this.state.showErrorBox) {
            return (
                <div className="error-textbox">
                    {this.state.errorsContent.map((el) => <p>{el}</p>)}
                </div>
            );
        }
    }

    render() {
        if (!this.state.isSubmitted) {
            return (
                <div className="auth-inner-table">
                    {this.drawForm()}
                </div>
            );
        } else {
            return (
                <div className="auth-inner">
                    <h1 className="project-title">{`Diseño enviado, ${this.state.design.designer_name}!`}</h1>
                    <p>Hemos recibido tu diseño y lo estamos procesando para que sea publicado.</p>
                    <Link to={`/enterprise/${this.state.companyId}/project/${this.state.projectId}/designs`} className="btn btn-primary btn-block">Aceptar</Link>
                </div>
            );
        }
    }

}

export default withRouter(AddDesign)