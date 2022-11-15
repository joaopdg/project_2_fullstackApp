# {switch}

<br>

## Description

Online exchange platform for second hand items.

<br>

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist.
- **500** - As a user I want to see a nice error page when the internal server encounters an error.
- **homepage** - As a user I want to be able to access the homepage to log in/sign up and browse through the different ads.
- **sign up** - As a user I want to sign up on the web page so that I can post an ad, comment and switch.
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account.
- **create** - As a user I want to be able to create a post with the item that I want to switch.
- **edit** - As a user I want to be able to edit my profile and my ads.
- **result** - As a user I want to see a filtered list of all the available ads and send switch requests.

<br>

## Server Routes (Back-end):

| **Method** | **Route**                             | **Description**                                                                    | Request - Body                                    |
| ---------- | ------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------- |
| `GET`      | `/`                                   | Main page route. Renders home `index` view.                                        |                                                   |
| `GET`      | `/login`                              | Renders `login` form view.                                                         |                                                   |
| `POST`     | `/login`                              | Sends `login` form data to the server.                                             | { email, password }                               |
| `GET`      | `/signup`                             | Renders `signup` form view.                                                        |                                                   |
| `POST`     | `/signup`                             | Sends `singup` info to the server and creates user in the DB.                      | { email, password, name, imageUrl }               |
| `GET`      | `/profile`                            | Render the `profile` view with all the ads from this user.                         |                                                   |
| `GET`      | `/profile/edit-profile`               | Private route. Renders `edit-profile` form view.                                   |                                                   |
| `POST`     | `/profile/edit-profile`               | Private route. Sends `edit-profile` info to server and updates user in DB.         | { email, password, firstName, lastName, imageUrl} |
| `GET`      | `/create-ad`                          | Private route. Render the `create-ad` view.                                        |                                                   |
| `POST`     | `/create-ad`                          | Private route. Sends the `create-ad` info to the server and creates a new ad in DB | {name, type, description, image, condition, user} |
| `GET`      | `/profile/ads/details/:id`            | Renders `ad-details` view for the particular ad.                                   |                                                   |
| `GET`      | `/profile/ads/details/:id/edit`       | Renders `ad-edit` view for the particular ad.                                      | {name, type, description, image, condition,user}  |
| `POST`     | `/profile/ads/details/:id/edit`       | Sends `ad-edit` info to the server and updates the current card.                   |                                                   |
| `DELETE`   | `/profile/ads/details/delete-card:id` | Private route. Deletes the existing ad from the current user.                      |                                                   |
| `GET`      | `/ads`                                | Renders `ads-list` view with all the ads from other users.                         |                                                   |
| `GET`      | `/ads/details/:id`                    | Renders `ad-details` view for the particular ad.                                   |                                                   |

## Models

User model

```javascript
{
  name: String,
  email: String,
  password: String,
  ads: [{ type: Schema.Types.ObjectId, ref: 'Ad' }],
  comments: [{type: Schema.Types.ObjectId, ref:"Comment"}],
  location: String,
  address: String,
  contact: Number,
  imageUrl: String
}

```

Ad model

```javascript
{
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  name: String,
  category: {
         type: String,
         enum: ['Clothes', "Accessories","Footwear", "Tech", "Books", "Sports", "Musical Instruments", "Furniture", "Other"]
  },
  description: String,
  condition: {
      type:String,
      enum:["New with tags ", " Excellent used condition", "Gently used and well mantained", "Very used"]
      },
  imageURL: String
}

```

Comment model

```javascript
{
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  ad: [{ type: Schema.Types.ObjectId, ref: 'Ad' }],
  title: String,
  description: String,

}

```

<br>

## API's

<br>

## Packages

<br>

## Backlog

[See the Trello board.](https://trello.com/b/Ik9Uipqb/project2)

<br>

## Links

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/joaopdg/project_2_fullstackApp)

[Deploy Link](https://project-fullstackapp.herokuapp.com/)

<br>

### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1P5FIi0vHZBUcgUtmt1M4_lLCO5dwdJ4UOgtJa4ehGfk/edit?usp=sharing)

### Contributors

João Gonçalves - [`Github`](https://github.com/joaopdg) - [`Linkedin`](https://www.linkedin.com/in/joaopdg/)

Mariana Oliveira - [`Github`](https://github.com/miloliveira) - [`Linkedin`](https://www.linkedin.com/in/miloliveira/)
