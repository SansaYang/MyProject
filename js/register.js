class Register {
    constructor() {
        this.$('.sui-btn').addEventListener('click', this.register.bind(this));
    }
    async register() {
        let uN = this.$('.user').value.trim();
        let uNreg = /^[a-z]{5,24}$/;
        let pwd = this.$('.pwd').value.trim();
        let pwdReg = /^\w{6,12}$/;
        let pwd2 = this.$('.pwd2').value.trim();
        let nick = this.$('.nick').value.trim();
        if (!uN) {
            this.$('.userBox .warn').innerHTML = '用户名不能为空';
            return;
        }
        if (!uNreg.test(uN)) {
            this.$('.userBox .warn').innerHTML = '用户名只能是5-24位的小写字母';
            return;
        };
        if(uN && uNreg.test(uN)) this.$('.userBox .warn').innerHTML = '';
        if (!pwd) {
            this.$('.pwdBox .warn').innerHTML = '密码不能为空';
            return;
        }
        if (!pwdReg.test(pwd)) {
            this.$('.pwdBox .warn').innerHTML = '密码是6-12位任意的数字字母或下划线';
            return;
        }
        if(pwd && pwdReg.test(pwd)) this.$('.pwdBox .warn').innerHTML = '';
        if (pwd2 != pwd) {
            this.$('.firmPwd .warn').innerHTML = '两次输入的密码不一致,请重新输入';
            return;
        }
        if(pwd2 == pwd) this.$('.firmPwd .warn').innerHTML = '';
        if (!this.$('.deal').checked) throw new Error('请勾选协议');
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        let par5 = `username=${uN}&password=${pwd}&rpassword=${pwd2}&nickname=${nick}`;
        let { status, data } = await axios.post('http://localhost:8888/users/register', par5);
        console.log(data);
        if (data.code == 1) {
            layer.msg('注册成功');
            setTimeout(function(){
                if (location.search) {
                    location.assign(location.search.split('=')[1]);
                } else {
                    location.assign('home.html');
                }
            },1200)
        } else if (data.code == 0) {
            document.querySelector('.userBox .warn').innerHTML = data.message;
        }
    }

    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }
}
new Register;