const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const animate = async () => {
    for (let index = 0; index < 16; index++) {
        let test = document.getElementById(index)
        test.style.backgroundColor = 'red'
        await sleep(1000);
        test.style.backgroundColor = test.className
    }
}

animate()