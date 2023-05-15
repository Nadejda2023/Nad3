import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

const corsMiddleware = cors();
app.use(corsMiddleware)
const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)


const port = process.env.PORT || 3003
const tod = new Date();
const created = new Date().toISOString();
const dataPost = new Date(tod.setDate(tod.getDate()+1)).toISOString();



const resolution: Array<string> = [
  'P144',
  'P240',
  'P360',
  'P480',
  'P720',
  'P1080',
  'P1440',
  'P2160']
export type videoType = {
  id: number,
  title: string,
  author: string,
  canBeDownloaded: boolean, 
  minAgeRestriction: null | number, 
  createdAt: string,
  publicationDate: number | string,
  availableResolutions: Array <string>
}

export type DB = {
  videos: videoType[]
}


const db: DB = {
  videos: [
  {
    "id": 0,
    "title": "Nadejda",
    "author": "string",
    "canBeDownloaded": false,
    "minAgeRestriction": null,
    "createdAt": created,
    "publicationDate": dataPost,
    "availableResolutions": ["P144"]
  },
  {
    "id": 1,
    "title": "string1",
    "author": "string1",
    "canBeDownloaded": false,
    "minAgeRestriction": null,
    "createdAt": created,
    "publicationDate": dataPost,
    "availableResolutions": []
  },

]
}
 
app.get('/', (req: Request, res: Response) => {
  res.status(200).send(db.videos)
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
  db.videos = []
  res.sendStatus(204)
})



app.get('/videos', (req: Request, res: Response) => {
  res.status(200).send(db.videos)
})
///get
app.get('/videos/:id', (req: Request, res: Response) => {
  const videoId = +req.params.id
  const video = db.videos.find(video => video.id === videoId)
  if (video) { 
     res.status(200).send(video) 
  } else {
    res.sendStatus(404)
  }

})
 



app.post('/videos', (req: Request, res: Response) => {
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions
    const errors = []
    

    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
      errors.push({message: 'error at title', field: 'title'})
    }
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
     errors.push({message: 'error at author', field: 'author'})
    }
    if (req.body.availableResolutions < 1) {
      errors.push({message: 'error at availableResolutions', field: 'availableResolutions'})
    }
    let prov: boolean = true
    req.body.availableResolutions.forEach((res:string) => {
      if(!resolution.includes(res)) prov = false
    })
    if(!prov) {
      errors.push({message: 'error at availableResolutions', field: 'availableResolutions'})
    }
    if (errors.length > 0) return res.status(400).send({errorsMessages: errors})
    const newVideo: videoType = {
      id: + (new Date()),
      title : title,
      author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: created,
      publicationDate: dataPost, 
      availableResolutions
    }
    db.videos.push(newVideo)
    res.status(201).send(newVideo)
  }
)

app.put('/videos/:id', (req: Request, res: Response) => {
  const videoId = +req.params.id
  const video = db.videos.find(video => video.id === videoId)
  if (video) { 
 res.sendStatus(204)
    video.author = req.body.author
    video.title = req.body.title
    video.canBeDownloaded = req.body.canBeDownloaded
    video.minAgeRestriction = req.body.minAgeRestriction
    video.publicationDate = req.body.publicationDate
    video.availableResolutions = req.body.availableResolutions


    const errors2 = []

    if (!video.title || video.title === null || typeof video.title !== 'string' || !video.title.trim() || video.title.length > 40) {
      errors2.push({message: 'error at title', field: 'title'})
    }
    if (!video.author || typeof video.author !== 'string' ||  video.author.length > 20) {
      errors2.push({message: 'error at author', field: 'author'})
    }
    if (req.body.availableResolutions < 1) {
      errors2.push({message: 'error at availableResolutions', field: 'availableResolutions'})
    }
    let prov: boolean = true
    video.availableResolutions.forEach((res:string) => {
      if(!resolution.includes(res)) prov = false
    })
    if(!prov) {
      errors2.push({message: 'error at availableResolutions', field: 'availableResolutions'})
    }
     
    if (video.minAgeRestriction !== null && typeof video.minAgeRestriction !== "number" ) {
      errors2.push({message: 'error ', field: 'title'})
    } else if (typeof video.minAgeRestriction === "number") {
    if (+video.minAgeRestriction <1 || +video.minAgeRestriction > 18) {
        errors2.push({message: 'error ', field: 'minAgeRestriction'})
      }
    //if (video.publicationDate !== dataPost ) {
       // errors2.push({message: 'error ', field: 'publicationDate'})
      //}
      
    }
    if (typeof(video.canBeDownloaded) !== "boolean" || typeof(video.canBeDownloaded) === "string") {
      errors2.push({message: 'error ', field: 'canBeDownloaded'})
    }
    if (errors2.length > 0) return res.status(400).send({errorsMessages: errors2})
  } else {
    db.videos = db.videos.filter(v => v.id !== videoId)
    res.sendStatus(404) 
  }
  })
   
  
    
    
app.delete('/videos/:id', (req: Request<{id:string}>, res: Response) => {
  const videoId = +req.params.id
  const video = db.videos.find(video => video.id === videoId)
if (!video) return res.sendStatus(404)
  db.videos = db.videos.filter(v => v.id !== videoId)
  return res.sendStatus(204)
  })

   



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})