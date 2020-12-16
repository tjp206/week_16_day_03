<template lang="html">
  <div>
    <h1>Login</h1>
    Email: <input type="text" v-model="email" />
    Password: <input type="password" v-model="password" />
    <button @click="login">Log in</button>
    {{ feedback }}
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'login',
  data() {
    return{
      email: '',
      password: '',
      feedback: ''
    }
  },
  methods: {
    login: function() {
      let user = {
        email: this.email,
        password: this.password
      }
      axios.post('http://localhost:3000/login', user)
      .then(res => {
        if(res.status === 200) {
          localStorage.setItem('token', res.data.token)
          this.$router.push('/');
        }
      }, err => {
        console.log(err.response);
        this.feedback = err.response.data.error;
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
