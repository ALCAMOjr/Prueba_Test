import jsonwebtoken from 'jsonwebtoken'


 const Middleware = (req, res, next) => {

    const authorizacion = req.get('authorization')

    let token = ''
    if (authorizacion && authorizacion.toLowerCase().startsWith('bearer')) {
        token = authorizacion.substring(7)
      
    }

    let decodedToken;
    try {
        decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        return res.status(401).send({ error: 'token missing or invalid' });
    }

    if (!token || !decodedToken.id) {
        return res.status(401).send({ error: 'token missing or invalid' });
    }

    const { id } = decodedToken;

    req.userId = id;


    next()
}

export default Middleware;