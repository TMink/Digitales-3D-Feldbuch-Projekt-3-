const express = require("express");
const router = express.Router();
const db = require("../fb");
const projects = db.collection("projects");


/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a project. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw project data from database
 * @returns project Json-Object with all required fields
 */
function getProjectJson(doc) {
  return {
    id: doc.id,
    title: doc.data().title,
    description: doc.data().description,
    excavations: doc.data().excavations,
    contacts: doc.data().contacts,
  };
}


/* GET ALL projects */
router.get("/", function (req, res, next) {
  var projectsArray = [];
  projects
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var project = getProjectJson(doc);
        projectsArray.push(project);
      });
      res.send(projectsArray);
    })
    .catch((err) => {
      res.status(404).send("No projects found");
    });
});

/* GET project by ID */
router.get("/:project_id", function (req, res, next) {
  projects
    .doc(req.params.project_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var project = getProjectJson(doc);
        res.send(project);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("Project not found: " + err);
    });
});

/* POST new project */
router.post("/", function (req, res, next) {
  projects
    .doc()
    .set(req.body)
    .then((response) => {
      res.status(200).send("Added project");
    })
    .catch((err) => {
      res.status(404).send("Couldn't add project: " + err);
    });
});

/* UPDATE project by ID*/
router.put("/:project_id", function (req, res, next) {
  projects
    .doc(req.params.project_id)
    .update(req.body)
    .then((response) => {
      res.status(200).send("Updated project: " + req.params.project_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't update project: " + err);
    });
});

/* DELETE project by ID*/
router.delete("/:project_id", async function (req, res, next) {
  //TODO: when deleting a project, also delete all subcollections
  projects
    .doc(req.params.project_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted project: " + req.params.project_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete project: " + err);
    });
});

module.exports = router;
