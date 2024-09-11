const app = Vue.createApp({

    data() {
        return {
            EquipmentsModal: false,
            addDeviceModal: false,
            pmModal: false,
            editDeviceModal: false,
            inputCount: 0,
            devices: [],
            equipments: [],
            pm: [],
            deviceImage: '',
            deviceId: null,
            deviceName: '',
            deviceLocation: '',
            tempEquip: [],
            addingDeviceType: '',
            addImage: '../images/Computer.png',
            addingName: '',
            addingLocation: '',
            addingTempPeriod: '',
            addingPeriod: [],
            addingTempEqName: '',
            addingEqName: [],
            addingEquipments: [],
            today: new Date().toISOString().slice(0,10),
            equipmentId: 1,
            equipmentName: 'computer',
            equipmentDeadline: '2025-05-18',
            tempPm: [],
            editingPm: {},
            editingDevice: {},
            // editingDeviceId: null,
            // editingDeviceImage: '',
            // editingDeviceName: '',
            // editingDeviceLocation: '',
            editingDeviceEquipments: [],
            EditAddEquipments: [],
            // now: new Date().toISOString().slice(0,10).split('-').join(''),
            // due: new Date().toISOString().slice(0,10)
        }
    },

    mounted() {
        fetch('http://localhost:3000/devices')
        // fetch('../file/devices.json')
        .then(res => res.json())
        .then(data => this.devices = data)

        fetch('http://localhost:3000/equipments')
        // fetch('../file/equipments.json')
        .then(res => res.json())
        .then(data => this.equipments = data)

        fetch('http://localhost:3000/pm')
        // fetch('../file/pm.json')
        .then(res => res.json())
        .then(data => this.pm = data)
    },

    methods: {
        openEquipments(d){
            this.tempEquip = []
            this.EquipmentsModal = true
            this.deviceImage = d.image
            this.deviceId = d.id
            this.deviceName = d.name
            this.deviceLocation = d.location

            for(equipment in this.equipments){
                if(this.equipments[equipment].deviceId === d.id){
                    this.tempEquip.push(this.equipments[equipment])
                }
            }

            // console.log(this.setDeadlineToAdd('monthly'))
        },
        deleteEquipment(eq){
            Swal.fire({
                title: "Are you sure?",
                text: "You want to Delete This Equipment!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Apply Deleting!"
              }).then((result) => {
                if (result.isConfirmed) {
                        for(e in this.equipments){
                            if(this.equipments[e].id === eq.id){
                                fetch('http://localhost:3000/equipments/' + eq.id, {
                                    method: 'DELETE'
                                })
                            }
                        }
                  Swal.fire({
                    title: "Successful!",
                    text: "Your Equipment has been Deleted.",
                    icon: "success"
                  });

                  setTimeout(() => {
                    location.reload()
                  }, 1500);
                }
            });
        },
        editDevice(dId){
            this.editingDeviceEquipments = []
            this.EditAddEquipments = []
            this.editDeviceModal = true
            this.editingDevice = {}
            for(d in this.devices){
                if(this.devices[d].id === dId){
                    this.editingDevice = this.devices[d]
                }
            }
            console.log(this.editingDevice)
            // this.editingDeviceImage = this.editingDevice.image
            // this.editingDeviceId = this.editingDevice.id
            // this.editingDeviceName = this.editingDevice.name
            // this.editingDeviceLocation = this.editingDevice.location

            for(e in this.equipments){
                if(this.equipments[e].deviceId === dId){
                    this.editingDeviceEquipments.push(this.equipments[e])
                }
            }
            // console.log(this.editingDeviceEquipments)
        },
        addEditingInput(){
            let equipmentToAdd = {
                // "id": null,
                // "deviceId": null,
                "name": "",
                "period": "",
                // "deadline": new Date().toISOString().slice(0,10)
            }
            this.EditAddEquipments.push(equipmentToAdd)
        },
        minusEditingInput(){
            if(this.EditAddEquipments.length > 0){
                this.EditAddEquipments.pop()
            }
        },
        submitEditDevice(dId){
            Swal.fire({
                title: "Are you sure?",
                text: "You want to Edit This Device!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Edit!"
              }).then((result) => {
                if (result.isConfirmed) {

                    fetch('http://localhost:3000/devices/'+ dId , {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(this.editingDevice)
                    })

                    let howManyEquip = null
                    for(e in this.equipments){
                        howManyEquip = this.equipments[e].id
                    }
                    for(ae in this.EditAddEquipments){
                        let equipment = {
                            id: howManyEquip + 1,
                            deviceId: this.editingDevice.id,
                            name: this.EditAddEquipments[ae].name,
                            period: this.EditAddEquipments[ae].period,
                            deadline: this.setDeadlineToAdd(this.EditAddEquipments[ae].period)
                        }
                        fetch('http://localhost:3000/equipments', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(equipment)
                        })
                        console.log(equipment)
                        howManyEquip++
                    }

                    for(ede in this.editingDeviceEquipments){
                        fetch('http://localhost:3000/equipments/'+ this.editingDeviceEquipments[ede].id, {
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(this.editingDeviceEquipments[ede])
                        })
                    }

                  Swal.fire({
                    title: "Successful!",
                    text: "Your Device has been Edited.",
                    icon: "success"
                  });

                  setTimeout(() => {
                    location.reload()
                  }, 1500);
                }
            });
        },
        cancelEditDevice(){
            Swal.fire({
                title: "Are you sure?",
                text: "You want to Cancel The Edit Device!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Cancel Edit!"
              }).then((result) => {
                if (result.isConfirmed) {
                    this.editDeviceModal = false
                  Swal.fire({
                    title: "Successful!",
                    text: "Your Editing has been Canceled.",
                    icon: "success"
                  });
                }
            });
        },
        deleteDevice(dId){
            Swal.fire({
                title: "Are you sure?",
                text: "You want to Delete This Device!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Delete!"
              }).then((result) => {
                if (result.isConfirmed) {
                    for(d in this.devices){
                        if(this.devices[d].id === dId){
                            fetch('http://localhost:3000/devices/' + dId, {
                                method: 'DELETE'
                            })
                            this.EquipmentsModal = false
                        }
                    }
                  Swal.fire({
                    title: "Successful!",
                    text: "Your Device has been Deleted.",
                    icon: "success"
                  });

                  setTimeout(() => {
                    location.reload()
                  }, 1500);
                }
            });
        },
        closeEquipments(){
            this.EquipmentsModal = false
        },
        openAddDevice(){
            // this.inputCount = 0
            this.addingEquipments = []
            this.addDeviceModal = true
        },
        closeAdd(){
            this.addDeviceModal = false
        },
        addDevice(){
            console.log(this.addingEquipments)
            Swal.fire({
                title: "Are you sure?",
                text: "You want to Add This Device!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Apply Adding!"
              }).then((result) => {
                if (result.isConfirmed) {

                    let ind = null
                    for(d in this.devices){
                        ind = this.devices[d].id
                    }

                    let Device = {
                        id: ind + 1,
                        name: this.addingName,
                        location: this.addingLocation,
                        type: this.addingDeviceType,
                        image: this.addImage,
                        isDone: true
                    }

                    fetch('http://localhost:3000/devices', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(Device)
                    })

                    // while(this.inputCount){
                    //     let equipment = {
                    //         id: howManyEquip,
                    //         deviceId: Device.id,
                    //         name: this.addingEqName,
                    //         period: this.addingPeriod,
                    //         deadline: this.setDeadlineToAdd(this.addingPeriod)
                    //     }
                    //     fetch('http://localhost:3000/equipments', {
                    //         method: 'POST',
                    //         headers: {'Content-Type': 'application/json'},
                    //         body: JSON.stringify(equipment)
                    //     })
                    //     console.log(equipment)
                    //     this.inputCount--
                    //     howManyEquip++
                    // }
                    let howManyEquip = null
                    for(e in this.equipments){
                        howManyEquip = this.equipments[e].id
                    }
                    for(ae in this.addingEquipments){
                        let equipment = {
                            id: howManyEquip + 1,
                            deviceId: Device.id,
                            name: this.addingEquipments[ae].name,
                            period: this.addingEquipments[ae].period,
                            deadline: this.setDeadlineToAdd(this.addingEquipments[ae].period)
                        }
                        fetch('http://localhost:3000/equipments', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(equipment)
                        })
                        console.log(equipment)
                        howManyEquip++
                    }
                    console.log(Device)

                  Swal.fire({
                    title: "Successful!",
                    text: "Your Device has been Added.",
                    icon: "success"
                  });

                  setTimeout(() => {
                    location.reload()
                  }, 1500);
                }
            });

            
        },
        setDeadlineToAdd(period){
            const newDate = new Date()
            const Deadline = new Date()

            
            if(period == 'yearly'){
                Deadline.setDate(newDate.getFullYear() + 1)
            }else if(period == 'weekly'){
                Deadline.setDate(newDate.getDate() + 7)
            }
            else{
                Deadline.setDate(newDate.getMonth() + 1)
            }
            return Deadline.toISOString().slice(0,10)
        },
        updateDate(eq){
            let lastDate = new Date(eq.deadline)
            let nextDate = new Date(eq.deadline)

            Swal.fire({
                title: "Are you sure?",
                text: "You want to Update This Equipments deadline!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Apply Updates!"
              }).then((result) => {
                if (result.isConfirmed) {
                    if(eq.period =='yearly'){
                        nextDate.setFullYear(lastDate.getFullYear() + 1)
                        eq.deadline = nextDate.toISOString().slice(0,10)
                    }
                    else if(eq.period =='monthly'){
                        nextDate.setMonth(lastDate.getMonth() + 1)
                        eq.deadline = nextDate.toISOString().slice(0,10)
                    }
                    else {
                        nextDate.setDate(lastDate.getDate() + 7)
                        eq.deadline = nextDate.toISOString().slice(0,10)
                    }

                    fetch('http://localhost:3000/equipments/' + eq.id, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(eq)
                    })

                  Swal.fire({
                    title: "Successful!",
                    text: "Your Equipment has been Updated.",
                    icon: "success"
                  });
                }
            });
            
        },
        updateDatePm(eq){
            let lastDate = new Date(eq.deadline)
            let nextDate = new Date(eq.deadline)
            
                if(eq.period =='yearly'){
                    nextDate.setFullYear(lastDate.getFullYear() + 1)
                    eq.deadline = nextDate.toISOString().slice(0,10)
                }
                else if(eq.period =='monthly'){
                    nextDate.setMonth(lastDate.getMonth() + 1)
                    eq.deadline = nextDate.toISOString().slice(0,10)
                }
                else {
                    nextDate.setDate(lastDate.getDate() + 7)
                    eq.deadline = nextDate.toISOString().slice(0,10)
                }

                fetch('http://localhost:3000/equipments/' + eq.id, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(eq)
                })
        },
        addInput(){
            // this.inputCount++
            let equipmentToAdd = {
                "id": null,
                "deviceId": null,
                "name": "",
                "period": "",
                "deadline": new Date().toISOString().slice(0,10)
            }
            this.addingEquipments.push(equipmentToAdd)

        },
        minusInput(){
            if(this.addingEquipments.length > 0){
                this.addingEquipments.pop()
                // this.inputCount--
            }
        },
        // 
        addName(){
            this.addingEqName.push(this.addingTempEqName)
        },
        // 
        addPeriod(){
            this.addingPeriod.push(this.addingTempPeriod)
        },
        // 
        changeImage(){
            if(this.addingDeviceType === "Voip"){
                this.addImage = '../images/Voip.png'
            } else if(this.addingDeviceType === 'Server') {
                this.addImage = '../images/Server.png'
            }
            else{
                this.addImage = '../images/Computer.png'
            }
        },
        changeEditingImage(){
            if(this.editingDevice.name === "Voip"){
                this.editingDevice.image = '../images/Voip.png'
            } else if(this.editingDevice.name === 'Server') {
                this.editingDevice.image = '../images/Server.png'
            }
            else{
                this.editingDevice.image = '../images/Computer.png'
            }
        },
        openPmModal(eq){
            this.tempPm = []
            this.editingPm = eq
            this.pmModal = true
            this.equipmentId = eq.id
            this.equipmentName = eq.name
            this.equipmentDeadline = eq.deadline

            for(p in this.pm){
                if(this.pm[p].equipmentId === eq.id){
                    this.tempPm.push(this.pm[p])
                }
            }
        },
        submitPm(){
            Swal.fire({
                title: "Are you sure?",
                text: "You want to Submit The PM!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Submit!"
              }).then((result) => {
                if (result.isConfirmed) {
                    this.updateDatePm(this.editingPm)
                    this.pmModal = false
                    console.log(this.editingPm)
                  Swal.fire({
                    title: "Successful!",
                    text: "Your PM has been Submited.",
                    icon: "success"
                  });
                }
            });
        },
        closePmModal(){
            Swal.fire({
                title: "Are you sure?",
                text: "You want to Cancel The PM!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Cancel it!"
              }).then((result) => {
                if (result.isConfirmed) {
                    this.pmModal = false
                  Swal.fire({
                    title: "Successful!",
                    text: "Your PM has been Canceled.",
                    icon: "success"
                  });
                }
            });
        }
        
    },
    
    computed:{
        
    }
})

app.mount('#app')