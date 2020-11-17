import LoadingAnimation from "../helpers/loading-animation.component";
import { withRouter } from "react-router";
import { Link } from "react-router-dom"
import React, { Component } from "react";
import '../components.css'
import Axios from "axios";

class ViewDesigns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            projectId: this.props.match.params.projectId,
            page: 1,
            designs_data: {},
        }
    }

    componentDidMount() {
        this.fetchDesigns()
    }

    fetchDesigns() {
        this.setState({
            isLoading: true,
        });

        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/enterprise/${this.props.companyId}/projects/${this.state.projectId}/designs/`,
            {
                headers: {
                    'Authorization': `Token ${this.props.userToken}`,
                },
                params: {
                    'page': this.state.page,
                }
            }
        )
            .then(res => {
                this.setState({
                    designs_data: res.data,
                    isLoading: false,
                });
            })
            .catch(err => {
                this.setState({
                    isLoading: false,
                });
                console.log(err)
            });
    }

    nextPage() {
        this.setState({
            page: this.state.page + 1
        });
        this.fetchDesigns()
    }

    previousPage() {
        this.setState({
            page: this.state.page - 1
        });
        this.fetchDesigns()
    }

    pageButtons() {
        return (
            <div className="row row-design">
                <div className="column column-design table-padding">
                    <button className="btn btn-primary btn-block" disabled={this.state.designs_data.previous == null} onClick={() => this.previousPage()}>Previous Page</button>
                </div>
                <div className="column column-design table-padding">
                    <button className="btn btn-primary btn-block" disabled={this.state.designs_data.next == null} onClick={() => this.nextPage()}>Next Page</button>
                </div>
            </div>
        );
    }

    getImageURL(backendURL, designURL) {
        return designURL
    }

    renderModifiedDownload(data) {
        if (data.desing_converted) {
            return (
                <div className="row row-design">
                    <a href={this.getImageURL(process.env.REACT_APP_BACKEND_URL, data.desing_converted)} download="modified.png" target="_blank">Descargar modificada</a>
                </div>
            );
        }
    }

    imagePreviewComponent(data) {
        if (data.desing_converted) {
            return (
                <div className="row row-design">
                    <img src={this.getImageURL(process.env.REACT_APP_BACKEND_URL, data.desing_converted)} style={{ maxWidth: '400px', marginBottom: '1em', }} alt="thumbnail" />
                </div>
            );
        } else {
            return (
                <div className="row row-design">
                    <img src={this.getImageURL(process.env.REACT_APP_BACKEND_URL, data.desing_original)} style={{ maxWidth: '400px', marginBottom: '1em', }} alt="thumbnail" />
                </div>
            );
        }
    }

    drawDesign(data, index) {
        return (
            <div className="auth-inner-table" key={data.design_uuid}>
                <div className="row row-design">
                    <h4 className="project-title">{`Diseño de ${data.designer_name} ${data.designer_lastname}`}</h4>
                </div>
                <div className="row row-design">
                    <p>{`Correo de contacto: ${data.designer_email}`}</p>
                </div>
                <div className="row row-design">
                    <p>{`Precio: $${data.design_price}`}</p>
                </div>
                {this.imagePreviewComponent(data)}
                <div className="row row-design">
                <p>{`Estado procesamiento: ${data.design_state}`}</p>
                </div>
                <div className="row row-design">
                    <a href={this.getImageURL(process.env.REACT_APP_BACKEND_URL, data.desing_original)} download="original.png" target="_blank">Descargar tamaño original</a>
                </div>
                {this.renderModifiedDownload(data)}
            </div>
        )
    }

    renderDesigns() {
        if (this.state.designs_data.count > 0) {
            return this.state.designs_data.results.map((el, index) => this.drawDesign(el, index))
        } else {
            return (
                <div className="auth-inner-table">
                    <p>No hay diseños para mostrar.</p>
                </div>
            )
        }
    }

    drawContent() {
        return (
            <div className="design-container">
                <div className='auth-inner-table'>
                    <Link className="btn btn-primary btn-block" to={`/project/${this.state.projectId}`}>Volver</Link>
                </div>
                {this.renderDesigns()}
                <div className='auth-inner-table'>
                    {this.pageButtons()}
                </div>
            </div>
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className='auth-inner'>
                    {LoadingAnimation()}
                </div>
            );
        } else {
            return this.drawContent();
        }
    }
}

export default withRouter(ViewDesigns);