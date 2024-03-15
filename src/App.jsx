import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios'
import {useState,useEffect} from 'react'
import './App.css'

const App=() => { 

  const [task,setTask]= useState(null)
  const[tasks,setTasks]= useState([])
  console.log(tasks)

}
  const plusTask= async (e)=>{
    e.preventDefault()
    let response = await axios.post('http://localhost:5000/tasks',{item:task,status:'incomplete'})
    console.log(response)
    if (response.data.message="created.task"){
      setTasks([...tasks,response.data.data])
      setTask('')
    }
    // setTasks([...tasks,{id:tasks.length+1,item:task,status:'incomplete'}])
    // setTask('')
  }
     
  const completeTask= async (checked,id) =>{
    if(checked===true){
      let updatedTask = await  axios.post(`http://localhost:5000/tasks/complete/${id}`)
      console.log(updatedTask)
      
      if(updatedTask.data.message === 'Task completed'){
        let newTasks=tasks.map((singleTask)=>{
          if(singleTask._id === id){
              return  updatedTask.data.data
          } else {
              return singleTask
          }
        })
        setTasks(newTasks)
      }
    } else {
      let newTasks=tasks.map((singleTask)=>{
        if (singleTask.id === id){
          return {id:singleTask.id, item:singleTask.item,status:'incomplete'}
        } else {
          return singleTask
        } 
      })
      setTasks(newTasks)
    }
  } 
  const getCompletedTasks =() => {
    let completedTasks=tasks.filter((task)=>task.status ==='complete')
    return completedTasks
  }
  const getIncompletedTasks =() => {
    let incompletedTasks=tasks.filter((task)=>task.status ==='incomplete')
    return incompletedTasks
  }
  const deleteTask= async (id)=>{
    let response=await axios.delete(`http://localhost:5000/tasks/${id}`)
     console.log(response)
     if(response.data.message === 'task deleted'){
       let newTasks = tasks.filter((tasks)=>{
        return tasks._id!==id
       })
       setTasks(newTasks)
     }

  useEffect(()=>{
    getAllTasks()
    console.log('this runs when the page has loaded for the first time!')
  },[task])

  return (
    <>
      <h1>Some tasks </h1>
      
      
      
      <form onSubmit={plusTask}>
          <input 
          placeholder="Type here" 
          style={styles.input} 
           value={task}
          onChange={(e)=>setTask(e.target.value)}
         />
         <button 
          style={task ? styles.btn : styles.greyBtn}
          disabled={task ? false : true}
          >Submit</button>
      </form>
        
      <h3>Incompleted task</h3>
      {
        getIncompletedTasks().map((task,idx)=>{
          return (
            <div style={styles.tskContainer}>
              <p>{idx + 1}.{task.item}</p> 
              <input type='checkbox'
              onChange={(e)=>completeTask(e.target.checked,task._id)}/>
            </div>
          )
        })
      }

      <h3>Completed Tasks</h3>
      {
         getCompletedTasks().map((task,idx)=>{
          return (
            <div style={styles.tskContainer}>
            <p>{idx + 1}.{task.item}</p>
            <DeleteIcon onClick={()=>deleteTask(task._id)}/>
            </div>
          
          // task.filter((task)=>task.status ==='complete' )
          // tasks.map((task,idx)=>{
          //   return (
          //     <div style={styles.tskContainer}>
          // <p>{idx + 1}.{task.item}</p>
          //  <p>{task.status}</p>

          //  <input type='checkbox'
          //   onChange={(e)=>completeTask(e.target.checked,task._id)}
          //   />
          //  </div>
          )
        })
      }
    </>  
  )
}

const styles={
  input: {
  padding:'10px',
  borderRadius:'10px',
  border:'1px solid #000000'
  },
  btn:{
     backgroundColor:'black',color:'white',
     margin:'10px',
  },
  tskContainer: {
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center'
  },
  greyBtn: {
    backgroundColor:'grey',
    cursor: 'not-allowed',
    margin:'10px'
  }
}

export default App
