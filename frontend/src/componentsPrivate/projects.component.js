import { Link } from "react-router-dom"
import axios from 'axios';
import React, { Component } from "react";
import LoadingComponent from "../helpers/loading-animation.component"

export default class ProjectsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            isLoading: false,
        }
    }

    componentDidMount() {
        this.fetchProjectsData()
    }

    fetchProjectsData = () => {
        var self = this;
        self.setState({
            isLoading: true
        })

        axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/enterprise/${this.props.companyId}/projects/`,
            {
                headers: {
                    'Authorization': `Token ${this.props.userToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }
        )
            .then(res => {
                self.setState({
                    projects: res.data,
                    isLoading: false,
                });
            }).catch(error => {
                self.setState({
                    isLoading: false,
                });
                console.log(error);
            })
    }

    drawIndividualProject(project) {
        return (
            <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{`$${project.cost}`}</td>
                <td><Link className="btn btn-primary btn-block" to={`/project/${project.id}`}>Detalles</Link></td>
            </tr>
        );
    }

    drawForm() {
        return (
            <div className="auth-inner-table">
                <h1 className="project-title">Mis proyectos</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Costo</th>
                            <th scope="col">Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.projects.map((el) => this.drawIndividualProject(el))}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="auth-inner">
                    {LoadingComponent()}
                </div>
            );
        } else {
            return (
                <div className="auth-inner">
                    {this.drawForm()}
                </div>
            );
        }
    }
}