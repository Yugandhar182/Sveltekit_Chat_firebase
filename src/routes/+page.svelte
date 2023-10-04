<script>
	import { onMount } from 'svelte';
	import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
        import firebaseApp from './firebase.js';
        import { Input, Label, Helper, Button, Card } from 'flowbite-svelte';
        import { Popover } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	
  
	let fullName = '';
	let message = '';
	let messages = [];
	let onlineUsers = [];
	let joinedChat = false;
	let currentDate = new Date().toLocaleDateString('en-US', {
           year: 'numeric',
           month: 'long',
           day: 'numeric',
        });

   
  
	// Firebase Realtime Database references
	const db = getDatabase(firebaseApp);
	const messagesRef = ref(db, 'messages');
	const onlineUsersRef = ref(db, 'onlineUsers');
	// Function to send a new message
	function sendMessage() {
	  if (message.trim() !== '') {
		push(messagesRef, {
		  fullName,
		  message,
		  timestamp: {
			'.sv': 'timestamp', // ServerValue.TIMESTAMP equivalent in v9
		  },
		});
		message = '';
	  }
	}
  
	function formatDate(timestamp) {
	const date = new Date(timestamp);
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'pm' : 'am';
	hours %= 12;
	hours = hours || 12;
	const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
	return formattedTime;
  }
  
// Function to add a new online user
function addOnlineUser() {
  if (fullName.trim() !== '') {
    const userExists = onlineUsers.some((user) => user.fullName === fullName);
    if (!userExists) {
      push(onlineUsersRef, { fullName }).then(() => {
        joinedChat = true; // Set the flag to indicate user joined the chat
      });
    } else {
      joinedChat = true; // Set the flag to indicate user joined the chat
	  console.log("user already exsits");
    }
  }
}


  
  
	// Listen for new messages and online users
	onMount(() => {
	  onValue(messagesRef, (snapshot) => {
		messages = Object.values(snapshot.val() || {});
	  });
  
	  onValue(onlineUsersRef, (snapshot) => {
		onlineUsers = Object.values(snapshot.val() || {});
		console.log("Online Users", onlineUsers);
	  });
	});
  
   let messageContainer; 
  
	function scrollToBottom() {
	  if (messageContainer) {
		messageContainer.scrollTop = messageContainer.scrollHeight;
	  }
	}
  
	onMount(scrollToBottom);
  
  
  
  
  </script>
	
	  {#if !joinedChat}

          <div>
            <Card img="https://images.unsplash.com/photo-1636751364472-12bfad09b451?" horizontal class="mb-4" style="width:1000px;margin-left:400px; margin-top:100px">
                <h1 style="color: red; font-weight:bold;font-size:20px">Enter your name to join the Chat</h1>
               
                  <Input  type="text" id="fullName" bind:value={fullName} placeholder="Enter your name"  style="width:350px;height:40px; margin-top:20px;border: 1px solid  blue;font-weight:bold" />
                  <Button on:click={addOnlineUser} style="color:white;background-color:blue;margin-top:20px">Join Chat</Button>
                
            </Card>
            </div>

		  {:else}

          <div class="main-container">
             <div class="message-container" bind:this={messageContainer}>
               
                <div class="current-date">
                    <p> {currentDate}</p>
                  
                  </div>
              
                  <hr>
				{#each messages as messageData}
                <div class="chat-message {messageData.fullName === fullName ? 'sender' : 'receiver'}">
               
   
              <span   class="chat-sender" style="color:black" >{messageData.fullName}:</span>
   
             <span style="color:blue;font-weight:bold" class="chat-content">{messageData.message}</span>
             <span class="chat-timestamp" style="color:black;margin-top:30px">{formatDate(messageData.timestamp)}</span>

            
             </div>
            {/each}

            </div>
            <div class="onlineusers-container">
                <h1 style="color: green; margin-left:40px;font-weight: bold;font-size:30px">Online users</h1>
                

               <hr>
                {#each onlineUsers as user}
                <div class="card-body" style="width: 220px; overflow-x: auto; overflow-y: hidden; height: 40px; margin-left:10px; margin-top:20px">
                   
                  <p style="color: black;margin-left:40px" class="username"  >{user.fullName}</p>
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`} alt="{user.fullName}" class="online-avatar" />
                </div>
              {/each}
            </div>
          
    

          </div>
          <div class="input-container">

            <Input  bind:value={message} type="text"  placeholder="Write messages" style=" width:900px; height:43px; color:blue; border: 1px solid  black ; font-weight:bold" />

        </div>
        <div class="button-container">
            <Button   on:click={sendMessage}  >Send</Button>
          </div>

          
       
        {/if}


	  
  
  <style>
  

    .current-date {
  text-align: center;
  margin-top: 10px;
  color: #df0c7d; /* Adjust the color to your preference */
  font-size: 20px; /* Adjust the font size to your preference */
  font-weight: bold;
}
 

 
  
  
  
  .online-avatar {
    width: 30px;
    height: 30px;
    margin-top: -28px;
    border-radius: 50%;
    margin-right: 10px;
    background-color: blueviolet;
    float:left; /* Align receiver avatars to the left */
  }

  .chat-message.sender {
    color: black;
    background-color: #ccc9eb; /* Add a background color to sender messages */
    margin-left: auto;
  }

  .chat-message.receiver {
    color: blue;
    background-color: #f0f0f0; /* Add a background color to receiver messages */
    margin-right:-100px;
  }

.button-container{

margin-left: 1007px;
width: 70px;
margin-top: -45px;

}
.onlineusers-container{
    width: 300px;
    height: 650px;
    border: 1px solid  rgb(76, 21, 227); /* Add a border for styling */
    margin-top:-650px;
    overflow-y: auto; 
  position: relative;
  margin-left: 10px;
 
}
  
 
  
	.input-container  {

    margin-top: -48px;
    height: 48px;
    width: 980px;
    margin-left: 410px;

  
	}
   
	
	.button-container{
	
	  margin-bottom:1px;
      background-color: blue;
      margin-left: 1320px;
      border: 1px;
	}
  .main-container{
	  margin-left:10px;
	  margin-top:10px;
   width: 1520px;
   height: 720px;

    border: 2px solid  white; /* Add a border for styling */

	}
	.message-container {
	 
	   border-radius: 5px;
	   margin-top: 10px;
		margin-left:330px;
		height: 650px;
		border: 0px solid #ccc;
	  width:1185px;
	  border: 1px solid  rgb(13, 212, 79); /* Add a border for styling */
	  justify-content: center;
	
	  overflow: auto;
	  }
  .chat-message {
	  margin: 5px;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  padding: 10px;
	  display: flex;
	  align-items: center;
	  width: 460px;
	  margin-left:20px;
	  height:70px;
    
	}
  
	.chat-sender {
	  font-weight: bold;
	  margin-right: 10px;
	  font-size: 14px;
      height: 20px;
	
	}
  
	.chat-timestamp {
	  margin-left: auto;
	}
  
	.chat-message.sender {
	 
	  color: black; 
	}
  
	.chat-message.receiver {
	 
	  color: blue;
	}
	.chat-content{
	  font-size:17px;
	
	}

    .card-body {
	  padding: 10px;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  margin-bottom: 5px;
	
	  height: 40px;
	}
  
   
 

  </style>
