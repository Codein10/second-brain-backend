
export function random(len:number){
const options ="dsfsfffgdfdsfsdvcxcvv1234434343";
const length=options.length
let ans=""
for(let i=0;i<len ; i++){
    ans +=options[Math.floor((Math.random()*length))]
}
return ans
}