const bcrypt = require('bcryptjs')
const Department = require('../models/department')
const AgentSupplier = require('../models/agent_supplier')
const ClinicalEngineer=require('../models/clinical_engineer')
const Equipment =require('../models/equipment')
const SpareParts = require('../models/spare_part')
const BreakDowns = require('../models/break_down')
const WorkOrders = require('../models/work_order')





exports.addDepartment=(req,res)=>{
 code=req.body.Code
 name=req.body.Name
 location=req.body.Location
 Department.create({Code:code,Name:name,Location:location}).then(dep =>{
 }).catch(err=> {
    console.log("ERROR!!!!!!",err)
    })
res.redirect('/department');


}



exports.addAgentSupplier=(req,res)=>{
    id=req.body.Id
    name=req.body.Name
    address=req.body.Address
    phone=req.body.Phone
    email=req.body.Email
    notes=req.body.Notes
    AgentSupplier.findByPk(id).then(agentSupplier => {
        if(agentSupplier){
            agentSupplier.Id=id;
            agentSupplier.Name=name;
            agentSupplier.Address=address;
            agentSupplier.Phone=phone;
            agentSupplier.Email=email;
            agentSupplier.Notes=notes;
            return agentSupplier.save();
        }
        else{
            return AgentSupplier.create({Id:id,Name:name,Adress:address,
                    Phone:phone,Email:email,Notes:notes})
        }
   
   }).then(r => res.redirect('/agentSupplier'))
   .catch(err => console.log("ERROR!!!!!!",err))
}


exports.addClinicalEngineer=(req,res)=>{
    dssn=req.body.DSSN
    fname=req.body.FName
    lname=req.body.LName
    address=req.body.Address
    phone=req.body.Phone
    email=req.body.Email
    age=req.body.Age
    workhours=req.body.workHours
    department=req.body.Department
    var departmentCode=null
    Department.findOne({where:{Name:department}}).then(department => { departmentCode=department.Code})
    if(req.body.Password)   
        bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.Password, salt, (err, hash) => {
        pass=hash 
        });
            
        });



    ClinicalEngineer.findByPk(dssn).then(clinicalEngineer=>{
        if(clinicalEngineer){
            clinicalEngineer.DSSN=dssn
            clinicalEngineer.FName=fname
            clinicalEngineer.LName=lname
            clinicalEngineer.Adress=address
            clinicalEngineer.Phone=phone
            clinicalEngineer.Email=email
            clinicalEngineer.Age=age
            clinicalEngineer.WorkHours=workhours
            clinicalEngineer.DepartmentCode=departmentCode
            return clinicalEngineer.save()
        }
        else{
            return ClinicalEngineer.create({DSSN:dssn,FName:fname,
                    LName:lname,Adress:address,Phone:phone,
                    Email:email,Age:age,WorkHours:workhours,
                    DepartmentCode:departmentCode,Password:pass})
        }
    }).then(r => res.redirect('/clinicalEngineer'))
    .catch(err => console.log("ERROR!!!!!!",err))

}

exports.addEquipment=(req,res) => {
    code=req.body.Code
    name=req.body.Name
    cost=req.body.Cost
    modelnumber=req.body.ModelNumber
    serialnumber=req.body.SerialNumber
    installationdate=req.body.InstallationDate
    manufacturer=req.body.Manufacturer
    location=req.body.Location
    department=req.body.Department
    agent=req.body.Agent
    var departmentCode=null
    var agentCode=null
    Department.findOne({where:{Name:department}}).then(department => { 
        if (department){
            departmentCode=department.Code
            AgentSupplier.findOne({where:{Id:agent}}).then(agent =>{
                if(agent){
                    agentCode=agent.Id
                    Equipment.findByPk(code).then(equipment=>{
                        if(equipment){
                            equipment.Code=code
                            equipment.Name=name
                            equipment.Cost=cost
                            equipment.ModelNumber=modelnumber
                            equipment.InstallationDate=installationdate
                            equipment.SerialNumber=serialnumber
                            equipment.Manufacturer=manufacturer
                            equipment.Location=location
                            equipment.DepartmentCode=departmentCode
                            equipment.AgentSupplierId=agentCode
                            requipment.save().then(equipment => res.redirect('/equipment'))
                        }
        
                        else
                        {
                            Equipment.create({Code:code,Name:name,
                                    Cost:cost,ModelNumber:modelnumber,SerialNumber:serialnumber,AgentSupplierId:agentCode,
                                    Location:location,Manufacturer:manufacturer,InstallationDate:installationdate,DepartmentCode:departmentCode})
                                    .then(equipment => res.redirect('/equipment') )
                        }
                    })
                }
                else
                  res.render('error',{layout:false,pageTitle:'Error',href:'/equipment',message:'Sorry !!! Could Not Get this Agent'})                
            })
        }
        else{
            res.render('error',{layout:false,pageTitle:'Error',href:'/equipment',message:'Sorry !!! Could Not Get this Department'})
        }
    }).catch(err => {
        if(err)
         res.render('error',{layout:false,pageTitle:'Error',href:'/sparePart',message:'Sorry !!! Could Not Add This Engineer '})

          
    })

}


exports.addSpareParts=(req,res)=>{
    code=req.body.Code
    name=req.body.Name
    amount=req.body.Amount
    agentId=req.body.AgentSupplierId
    var AgentId = null
    AgentSupplier.findOne({where:{Id:agentId}}).then(agent =>{
        if(agent){
            SpareParts.findByPk(code).then(part=>{
                if(part){
                    part.Code=code
                    part.Name=name
                    part.Amount=amount
                    part.AgentSupplierId=agentId
                    return part.save()
                }
        
            SpareParts.create({Code:code,Name:name,Amount:amount,AgentSupplierId:agentId})
            .then(res.redirect('/sparePart'))
            .catch(err=> {
                console.log("ERROR!!!!!!",err)
                })
            })
        }
        else
         return res.render('error',{layout:false,pageTitle:'Error',href:'/sparePart',message:'Sorry !!! Could Not Get this Agent'})
        
    })

}



exports.addBreakDown=(req,res)=>{
    code=req.body.Code
    reason=req.body.Reason
    date=req.body.DATE
    equipmentId=req.body.EquipmentCode
    var equID = null
    Equipment.findOne({where:{Code:equipmentId}}).then(Equipment =>{
        if(Equipment){
            BreakDowns.findByPk(code).then(breakD=>{
                if(breakD){
                    breakD.Code=code
                    breakD.Reason=reason
                    breakD.DATE=date
                    breakD.EquipmentCode=equipmentId
                    return breakD.save()
                }
        
                BreakDowns.create({Code:code,Reason:reason,DATE:date,EquipmentCode:equipmentId})
                .then(res.redirect('/breakDown'))
                .catch(err=> {
                    console.log("ERROR!!!!!!",err)
                    })
                })
        }
        else
         return res.render('error',{layout:false,pageTitle:'Error',href:'/breakDown',message:'Sorry !!! Could Not Get this Equipment'})
        
    })

}


exports.addWorkOrder=(req,res) => {
    code=req.body.Code
    cost=req.body.Cost
    date=req.body.DATE
    priority = req.body.Priority
    equipmentId=req.body.EquipmentCode
    engineerId=req.body.ClinicalEngineerDSSN
    var equId=null
    var engId=null
    Equipment.findOne({where:{Code:equipmentId}}).then(Equipment => { 
        if (Equipment){
            equipment=Equipment.Code
            ClinicalEngineer.findOne({where:{DSSN:engineerId}}).then(ClinicalEngineer =>{
                if(ClinicalEngineer){
                    EngineerCode=agent.Id
                    WorkOrder.findByPk(code).then(WorkOrder=>{
                        if(equipment){
                            WorkOrder.Code=code
                            WorkOrder.DATE=date
                            WorkOrder.Cost=cost
                            WorkOrder.EquipmentCode = equipment
                            WorkOrder.ClinicalEngineerDSSN = EngineerCode
                            WorkOrder.Priority = priority
                            WorkOrder.save().then(WorkOrder => res.redirect('/workOrder'))
                        }
        
                        else
                        {
                            WorkOrders.create({Code:code,DATE:date,
                                    Cost:cost,ModelNumber:modelnumber,EquipmentCode:equipment,ClinicalEngineerDSSN:EngineerCode,Priority:priority})
                                    .then(WorkOrder => res.redirect('/workOrder') )
                        }
                    })
                }
                else
                  res.render('error',{layout:false,pageTitle:'Error',href:'/workOrder',message:'Sorry !!! Could Not Get this Engineer'})                
            })
        }
        else{
            res.render('error',{layout:false,pageTitle:'Error',href:'/workOrder',message:'Sorry !!! Could Not Get this Equipment'})
        }
    }).catch(err => {
        if(err)
         res.render('error',{layout:false,pageTitle:'Error',href:'/workOrder',message:'Sorry !!! Could Not Add This Work Order '})

          
    })

}
