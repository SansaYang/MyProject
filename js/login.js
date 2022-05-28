class Login {
    constructor() {
        this.$('.sui-form').addEventListener('click', this.login1.bind(this));
    }

    async login1({target}) {
        if(!target.classList.contains('sui-btn') && !target.classList.contains('logined')) return;
        let form = '';
        if(target.classList.contains('sui-btn') && target.nodeName == 'A'){
            form= target.parentNode.parentNode;
        }
        if(target.classList.contains('logined') && target.nodeName == 'DIV'){
            form= target.parentNode;
        }
        // console.log(form);
        let uN = this.$('form #email').value.trim();
        let pwd = this.$('form #pwd').value.trim();
        if(!uN || !pwd) throw new Error('用户名或密码不能为空~');
        let par2 = `username=${uN}&password=${pwd}`;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';       
        let { status, data } = await axios.post('http://localhost:8888/users/login',par2);
        setTimeout(function(){
            if(status == 200 && data.code == 1){
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id',data.user.id);
                location.assign(location.search.split('=')[1]);
            }
        },100)
    }

    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }
}
new Login;