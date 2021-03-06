from flask import jsonify, request, redirect
from app import app, db
from models import Link, Analytics
from urllib.parse import urlparse
from uuid import uuid4


# routes
@app.route('/')
def test_route():
    """
    this route is to test the server via browser or postman
    """
    return jsonify({'working': True})


@app.route('/api/link', methods=['POST'])
def add_link():
    """
    CREATE

    post request that takes in the following:
        - a user id
        - url/link
        - title
        - date
        - analytics
            -- when creating a link analytics is often a list (that is empty)
               Rhat includes object of date and click

    should return the input but with mongo id (_id)
    """
    request_data = request.get_json()

    userId = request_data['userId']
    link = request_data['link']
    title = request_data['title']
    date = request_data['date']
    analytics = request_data['analytics']

    base_url = urlparse(request.base_url)

    protocol = base_url.scheme
    host = base_url.netloc
    redirectId = str(uuid4())

    redirectURL = f'{protocol}://{host}/redirect/{redirectId}'

    link = Link(
        userId=userId,
        redirectId=redirectId,
        redirectURL=redirectURL,
        link=link,
        title=title,
        date=date
    )

    db.session.add(link)
    db.session.commit()

    link_data = {
        'id': link.id,
        'userId': link.userId,
        'redirectId': link.redirectId,
        'redirectURL': link.redirectURL,
        'link': link.link,
        'title': link.title,
        'date': link.date,
        'analytics': []
    }

    return jsonify(link_data)

# Read
@app.route('/api/links/<userId>/', methods=['GET'])
def get_links(userId):
    """
    READ

    get request that includes the user's id (userId) as a parameter

    should return a list of object of the user's links

    ***IMPORTANT***
    The following code does not scale well because of the following
    1) It queries all links from the database
    2) Loop inside a loop

    ***EXPLANATION***
    I wrote the code this way because the data structure was optimized 
    for a document database. This project was for me to review python 
    and flask. Using a premade front end form a different project allowed 
    me to focus on the backend. Ideally, I would have a pagination system 
    to limit the initial query and have a separate api to handle the 
    'analytics'. This would mean rewriting the front end. An alternative 
    path would be to not use an ORM and write more complex SQL queries.
    """
    query = Link.query.filter_by(userId=userId).all()

    links = []

    for l in query:

        link = {}

        link['id'] = l.id
        link['redirectId'] = l.redirectId
        link['redirectURL'] = l.redirectURL
        link['userId'] = l.userId
        link['link'] = l.link
        link['title'] = l.title
        link['date'] = l.date

        analytics = []

        if l.analytics:
            for link_data in l.analytics:
                data_object = {}

                data_object['date'] = link_data.date
                data_object['clicks'] = link_data.clicks

                analytics.append(data_object)

        link['analytics'] = analytics

        links.append(link)

    return jsonify(links)

@app.route('/api/link/edit/<linkId>', methods=['PUT'])
def update_link(linkId):
    """
    UPDATE

    put request that asks for link id (linkId) as a parameter
    w/ the request body as an object of the link and it's
    updated values

    should return the mongo version of the response as an object
    """
    request_data = request.get_json()

    title = request_data['title']
    date = request_data['date']

    link_to_edit = Link.query.filter_by(id=linkId).first_or_404()

    link_to_edit.title = title
    link_to_edit.date = date

    db.session.commit()

    link = {}

    link['id'] = link_to_edit.id
    link['redirectId'] = link_to_edit.redirectId
    link['redirectURL'] = link_to_edit.redirectURL
    link['userId'] = link_to_edit.userId
    link['link'] = link_to_edit.link
    link['title'] = link_to_edit.title
    link['date'] = link_to_edit.date

    analytics = []

    if link_to_edit.analytics:
        for link_data in link_to_edit.analytics:
            data_object = {}

            data_object['date'] = link_data.date
            data_object['clicks'] = link_data.clicks

            analytics.append(data_object)

    link['analytics'] = analytics

    return jsonify(link)

@app.route('/api/link/delete/<linkId>/', methods=['DELETE'])
def delete_link(linkId):
    """
    DELETE

    delete request that takes in the link id (linkId as a parameter)
    the link id will be used by mongoose to delete the object

    should return a random string with a 200 code to show that the link
    has been successfully delete the object

    should return a random string with a 200 code to show that the link
    has been successfully deleted
    """
    link_to_delete = Link.query.filter_by(id=linkId).first_or_404()
    db.session.delete(link_to_delete)
    db.session.commit()
    return 'Deleted successfully!'


@app.route('/redirect/<redirectId>', methods=['GET'])
def redirect_url(redirectId):
    """
    REDIRECT

    get requests with a link id (redirectId) as a parameter

    should do the following two things
    - add a click (+1) to the link's analytics
    - should get the link's redirect url and redirect to that url
    """
    # find out todays name in M/D/Y
    today = date.today()
    formated_day = f'{today.month}/{today.day}/{today.year}'

    # find link with redirectID
    link = Link.query.filter_by(redirectId=redirectId).first_or_404()

    if link.analytics:
        #  link DOES exsits
        analytics = Analytics.query.filter_by(
            date=formated_day, link_id=link.id).first_or_404()
        analytics.clicks += 1
        db.session.commit()
        return redirect(link.link)
    else:
        # link DOES NOT exsits
        analytics = Analytics(date=formated_day, clicks=1, link=link)
        db.session.add(analytics)
        db.session.commit()
        return redirect(link.link)
