import * as contentful from 'contentful'

class Contentful {
  constructor() {
    this.client = contentful.createClient({
      space: process.env.REACT_APP_SPACE,
      accessToken: process.env.REACT_APP_ACCESS_TOKEN,
    });
  }

  getPostfromContentful = () =>
     this.client.getEntries();
}

export default Contentful;