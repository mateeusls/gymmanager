const { age, date } = require("../utils");
const fs = require("fs"); // Fs is lib of write date
const data = require("../data.json"); // This is our DB while we not have one structured;

exports.index = (req, res) => {
  return res.render("instructors/index", { instructors: data.instructors });
}

exports.show = (req, res) => {
  const { id } = req.params
  const foundInstructor = data.instructors.find((instructor) => {
    return instructor.id == id
  })

  if (!foundInstructor) return res.send("Instructor not found!!")

  const instructor = {
    ...foundInstructor,
    age: age(foundInstructor.birth),
    services: foundInstructor.services.split(","),
    created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
  }

  return res.render("instructors/show", { instructor })
}

exports.create = (req, res) => { 
  return res.render("instructors/create"); 
}

exports.post = (req, res) => {
  const keys = Object.keys(req.body); // We are catching all the values of form;

  for (key of keys) {   // Using the expression FOR to verify if inputs is filled;
    if (req.body[key] == "") {
      return res.send("Please, fill all fields");
    }
  }

  let { // Destructureding datas of instructor
    avatar_url,
    birth,
    name,
    services,
    gender,
  } = req.body

  // Structured datas for send to database;
  birth = Date.parse(birth); 
  const created_at = Date.now();
  const id = Number(data.instructors.length + 1)


  data.instructors.push({ // Send datas to database;
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at
  });

  // Using FS for write dates in data.json while DB not is created;
  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error!");

    return res.redirect("/instructors");
  });
};

exports.edit = (req, res) => {
  const { id } = req.params
  const foundInstructor = data.instructors.find((instructor) => {
    return instructor.id == id
  })

  if (!foundInstructor) return res.send("Instructor not found!!")

  const instructor = {
    ...foundInstructor,
    birth: date(foundInstructor.birth)
  }

  return res.render("instructors/edit", { instructor })
}

exports.put = (req, res) => {
  const { id } = req.body
  let index = 0
  const foundInstructor = data.instructors.find((instructor, foundIndex) => {
    if(id == instructor.id){
      index = foundIndex
      return true
    }
  })

  if (!foundInstructor) return res.send("Instructor not found!!")

  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.instructors[index] = instructor

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if(err) return res.send("Write Error!")

    return res.redirect(`instructors/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body

  const filteredInstructors = data.instructors.filter((instructor)=>{
    return instructor.id != id   
  })

  data.instructors = filteredInstructors

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if(err) return res.send("Write file Error!")

    return res.redirect('/instructors')
  })
}