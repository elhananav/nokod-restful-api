const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const { apiKey } = require("../auth"); // Path to the authentication middleware

const expect = chai.expect;
chai.use(chaiHttp);

describe("tasks List API Tests", () => {
  let taskId = null;
  //Get the ID of the first task
  before((done) => {
    chai
      .request(app)
      .get("/task")
      .set("api_key", apiKey)
      .end((err, res) => {
        if (res && res.body && res.body.length > 0) {
          taskId = res.body[0].id; // Get the ID of the first task
        }
        done();
      });
  });

  //Test PUT endpoint
  it("should update a task (authenticated)", (done) => {
    const updatedTask = { title: "Updated Title" }; // Define the updated task object
    chai
      .request(app)
      .put(`/task/${taskId}`)
      .set("api_key", apiKey)
      .send(updatedTask) // Send the updated task object in the request body
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("id", taskId);
        expect(res.body).to.have.property("title", "Updated Title");
        done();
      });
  });
  
  //Test GET /task/:{id} endpoint
  it('should get a task by ID (authenticated)', (done) => {
    chai.request(app)
      .get(`/task/${taskId}`)
      .set('api_key', apiKey)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id', taskId);
        done();
      });
  });
  
  //Test DELETE endpoint
  it("should delete a task (authenticated)", (done) => {
    chai
      .request(app)
      .delete(`/task/${taskId}`)
      .set("api_key", apiKey)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("id", taskId);
        // Add more assertions as needed
        done();
      });
  });

  //Test GET /task endpoint
  it("should get all tasks", (done) => {
    chai
      .request(app)
      .get("/task")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  //Test POST endpoint
  it("should create a new task (authenticated)", (done) => {
    const newTask = { title: "New Task" }; // Define the new task object

    chai
      .request(app)
      .post("/task")
      .set("api_key", apiKey)
      .send(newTask) // Send the new task object in the request body
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("title", "New Task");
        done();
      });
  });


});
