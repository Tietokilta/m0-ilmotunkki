import {v4} from 'uuid';

type Event = {
  params: {
    data: any
    select: any
    where: any
    orderBy: any
    limit: any
    offset: any
    populate: any
  }
}


export default {
  beforeCreate(event: Event) {
    const { data } = event.params;
    data.uid = v4();
  }
}