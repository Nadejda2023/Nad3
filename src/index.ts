import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

const corsMiddleware = cors();
app.use(corsMiddleware)
const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)


const port = process.env.PORT || 3003
const today = new Date();
today.setDate(today.getDate() + 1);


const resolutionType = ["P144","P240","P360","P480",'P720','P1080',"P1440","P2160"]
export type videoType = {
  id: number,
  title: string,
  author: string,
  canBeDownloaded: boolean, 
  minAgeRestriction: null | number, 
  createdAt: string,
  publicationDate: string,
  availableResolutions: string[]
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
    "createdAt": new Date().toISOString(),
    "publicationDate": new Date().toISOString(),
    "availableResolutions": []
  }
]
}
 

app.delete('/testing/all-data', (req: Request, res: Response) => {
  db.videos = []
  res.sendStatus(204)
})



app.get('/videos', (req: Request, res: Response) => {
  res.status(200).send(db.videos)
})
app.get('/videos/:id', (req: Request, res: Response) => {
  const videoId = +req.params.id
  const video = db.videos.find(video => video.id === videoId)
  if (!video) return res.sendStatus(404)
  return res.status(200).send(video)
 
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
    //if (availableResolutions.length > 0 && availableResolutions.indexOf(availableResolutions)) {

    //}
    if (errors.length > 0) return res.status(400).send({errorsMessages: errors})
    const newVideo: videoType = {
      id: +(today.getDate() + 1),
      title : title,
      author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: today.toISOString(), 
      availableResolutions
    }
    db.videos.push(newVideo)
    res.status(201).send(newVideo)
  }
)

app.put('/videos/:id', (req: Request, res: Response) => {
  
    const videoId = +req.params.id
    const video = db.videos.find(video => video.id === videoId)
    if (!video) return res.sendStatus(404)
    video.author = req.body.author
    video.title = req.body.title
    video.canBeDownloaded = req.body.canBeDownloaded
    video.minAgeRestriction = req.body.minAgeRestriction
    video.publicationDate = req.body.publicationDate
    video.availableResolutions = req.body.availableResolutions
    let availableResolutions = video.availableResolutions

    const errors2 = []

    if (!video.title || typeof video.title !== 'string' || !video.title.trim() || video.title.length > 40) {
      errors2.push({message: 'error at title', field: 'title'})
    }
    if (!video.author || typeof video.author !== 'string' ||  video.author.length > 20) {
      errors2.push({message: 'error at author', field: 'author'})
    }
    //if (availableResolutions) {
     
  if (video.minAgeRestriction !== null && typeof video.minAgeRestriction !== "number" ) {
      errors2.push({message: 'error ', field: 'title'})
    } else if (typeof video.minAgeRestriction === "number") {
      if (+video.minAgeRestriction <1 || +video.minAgeRestriction > 18) {
        errors2.push({message: 'error ', field: 'canBeDownloaded'})
      }
      if (video.publicationDate !== "string" ) {
        errors2.push({message: 'error ', field: 'title'})
      }
      if (errors2.length > 0) return res.status(400).send({errorsMessages: errors2})
    }

    
     res.sendStatus(204)
   }
  )
    
    
app.delete('/videos/:id', (req: Request, res: Response) => {
  const videoId = +req.params.id
  const video = db.videos.find(video => video.id === videoId)
  if (!video) return res.sendStatus(404)
  db.videos = db.videos.filter(v => v.id !== videoId)
  return res.sendStatus(204)
  })

   



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})