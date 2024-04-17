import React, { Component } from "react";
import PeopleDataServiceInstance from "../services/people.service";
import { Link } from "react-router-dom";

export default class PeopleList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrievePeople = this.retrievePeople.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActivePeople = this.setActivePeople.bind(this);
    this.removeAllPeople = this.removeAllPeople.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      people: [],
      currentPeople: null,
      currentIndex: -1,
      searchTitle: ""
    };
  }

  componentDidMount() {
    this.retrievePeople();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  retrievePeople() {
    PeopleDataServiceInstance.getAll()
      .then(response => {
        this.setState({
          people: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrievePeople();
    this.setState({
      currentPeople: null,
      currentIndex: -1
    });
  }

  setActivePeople(people, index) {
    this.setState({
      currentPeople: people,
      currentIndex: index
    });
  }

  removeAllPeople() {
    PeopleDataServiceInstance.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchTitle() {
    PeopleDataServiceInstance.findByTitle(this.state.searchTitle)
      .then(response => {
        this.setState({
          people: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchTitle, people, currentPeople, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Поиск по имени"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Поиск
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Список редисок</h4>

          <ul className="list-group">
            {people &&
              people.map((people, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActivePeople(people, index)}
                  key={index}
                >
                  {people.title}
                </li>
              ))}
          </ul>

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllPeople}
          >
            Удалить всех!
          </button>
        </div>
        <div className="col-md-6">
          {currentPeople ? (
            <div>
              <h4>Редиски</h4>
              <div>
                <label>
                  <strong>Имя:</strong>
                </label>{" "}
                {currentPeople.title}
              </div>
              <div>
                <label>
                  <strong>Описание:</strong>
                </label>{" "}
                {currentPeople.description}
              </div>
              <div>
                <label>
                  <strong>Статус:</strong>
                </label>{" "}
                {currentPeople.published ? "Published" : "Pending"}
              </div>

              <Link
                to={"/people/" + currentPeople.id}
                className="badge badge-warning"
              >
                Редактировать
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Нажмите на редиску, чтобы получить подробную информацию...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}