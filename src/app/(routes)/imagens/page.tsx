
export default async function imagens(){
    const arrayImagens: Array<object> = [];
    for(let i = 0; i < 10; i++){
        const response = await fetch(`https://picsum.photos/400/400`);
        if(response.ok){
            arrayImagens.push({url: response.url});
        }
    }
    console.log(arrayImagens)
}