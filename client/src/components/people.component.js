import React, { Component } from "react";
import PeopleDataServiceInstance from "../services/people.service";
import { withRouter } from '../common/with-router';

class People extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getPeople = this.getPeople.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updatePeople = this.updatePeople.bind(this);
    this.deletePeople = this.deletePeople.bind(this);

    this.state = {
      currentPeople: {
        id: null,
        title: "",
        description: "",
        published: false
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getPeople(this.props.router.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function(prevState) {
      return {
        currentPeople: {
          ...prevState.currentPeople,
          title: title
        }
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;
    
    this.setState(prevState => ({
      currentPeople: {
        ...prevState.currentPeople,
        description: description
      }
    }));
  }

  getPeople(id) {
    PeopleDataServiceInstance.get(id)
      .then(response => {
        this.setState({
          currentPeople: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePublished(status) {
    var data = {
      id: this.state.currentPeople.id,
      title: this.state.currentPeople.title,
      description: this.state.currentPeople.description,
      published: status
    };

    PeopleDataServiceInstance.update(this.state.currentPeople.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentPeople: {
            ...prevState.currentPeople,
            published: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePeople() {
    PeopleDataServiceInstance.update(
      this.state.currentPeople.id,
      this.state.currentPeople
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "Список редисок был успешно обновлен!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deletePeople() {    
    PeopleDataServiceInstance.delete(this.state.currentPeople.id)
      .then(response => {
        console.log(response.data);
        this.props.router.navigate('/people');
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentPeople } = this.state;

    return (
      <div>
        {currentPeople ? (
          <div className="edit-form">
            <h4>People</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentPeople.title}
                  onChange={this.onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentPeople.description}
                  onChange={this.onChangeDescription}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Статус:</strong>
                </label>
                {currentPeople.published ? "Published" : "Pending"}
              </div>
            </form>

            {currentPeople.published ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(false)}
              >
                UnPublish
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(true)}
              >
                Publish
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deletePeople}
            >
              Удалить
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updatePeople}
            >
              Обновить
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Нажмите на редиску, чтобы получить подробную информацию...</p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(People);