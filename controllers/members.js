const { age, date } = require("../utils");
const fs = require("fs"); // Fs is lib of write date
const data = require("../data.json"); // This is our DB while we not have one structured;

exports.index = (req, res) => {
  return res.render("members/index", { members: data.members });
}

exports.show = (req, res) => {
  const { id } = req.params
  const foundMember = data.members.find((member) => {
    return member.id == id
  })

  if (!foundMember) return res.send("Member not found!!")

  const member = {
    ...foundMember,
    age: age(foundMember.birth),
  }

  return res.render("members/show", { member })
}

exports.create = (req, res) => { 
  return res.render("members/create"); 
}

exports.post = (req, res) => {
  const keys = Object.keys(req.body); // We are catching all the values of form;

  for (key of keys) {   // Using the expression FOR to verify if inputs is filled;
    if (req.body[key] == "") {
      return res.send("Please, fill all fields");
    }
  }

  // Structured datas for send to database;
  birth = Date.parse(req.body.birth); 
  let id = 1
  const lastMember = data.members[data.members.length - 1]
  if (lastMember) {
    id = lastMember.id + 1
  }

  data.members.push({ // Send datas to database;
    id,
    ...req.body, 
    birth,
  });

  // Using FS for write dates in data.json while DB not is created;
  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error!");

    return res.redirect("/members");
  });
};

exports.edit = (req, res) => {
  const { id } = req.params
  const foundMember = data.members.find((member) => {
    return member.id == id
  })

  if (!foundMember) return res.send("Member not found!!")

  const member = {
    ...foundMember,
    birth: date(foundMember.birth)
  }

  return res.render("members/edit", { member })
}

exports.put = (req, res) => {
  const { id } = req.body
  let index = 0
  const foundMember = data.members.find((member, foundIndex) => {
    if(id == member.id){
      index = foundIndex
      return true
    }
  })

  if (!foundMember) return res.send("Member not found!!")

  const member = {
    ...foundMember,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.members[index] = member

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if(err) return res.send("Write Error!")

    return res.redirect(`members/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body

  const filteredMembers = data.members.filter((member)=>{
    return member.id != id   
  })

  data.members = filteredMembers

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if(err) return res.send("Write file Error!")

    return res.redirect('/members')
  })
}