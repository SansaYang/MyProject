class Register{
    constructor(){
        this.$('.sui-btn').addEventListener('click', this.register.bind(this));
    }
    async register(){
        let uN = this.$('.user').value.trim();
        let pwd = this.$('.pwd').value.trim();
        let pwd2 = this.$('.pwd2').value.trim();
        let nick = this.$('.nick').value.trim();
        if(!uN || !pwd || !pwd2 || !nick) throw new Error('用户名或密码或昵称不能为空');
        if(!this.$('.deal').checked) throw new Error('请勾选协议');
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        let par5 = `username=${uN}&password=${pwd}&rpassword=${pwd2}&nickname=${nick}`;
        let {status,data} = await axios.post('http://localhost:8888/users/register', par5);
        // console.log(status);
        if(data.code == 1){
            location.assign(location.search.split('=')[1]);
        }
    }

    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }
}
new Register;