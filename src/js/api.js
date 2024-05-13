export default class SubsctiptionApi {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async add(user) {
    const request = fetch(`${this.apiUrl}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cors: 'no-cors',
      },
      body: JSON.stringify(user),
    });

    const result = await request;

    if (!result.ok) {
      console.error((await result.json()).status);
    }
  }

  async check(user) {
    const request = fetch(`${this.apiUrl}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cors: 'no-cors',
      },
      body: JSON.stringify(user),
    });

    const result = await request;

    const json = await result.json();
    console.log('check', json);
    return json;
  }

  async remove(user) {
    const query = `subscriptions/${encodeURIComponent(user.name)}`;

    const request = fetch(this.apiUrl + query, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await request;

    if (!result.ok) {
      console.error(result.response.body.status);
    }
  }
}
