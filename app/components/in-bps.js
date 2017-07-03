import Ember from 'ember'
import * as d3 from 'd3'

export default Ember.Component.extend({
  classNames: ['bps-in'],
  url: 'http://10.33.1.97:4242/api/series/qf-in-bps',
  title: 'bps (in)',
  gfill: '#E91E63',
  didInsertElement () {
    this._super(...arguments)
    // time parser for influx timestamp
    var parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%SZ')
    var xTime = d3.timeFormat('%H:%M')

    // get svg width and height from DOM
    var widget = d3.select('.' + this.get('classNames') + ' > .dash-widget')
    var svg = d3.select('.' + this.get('classNames') + ' > .dash-widget' + ' > svg')
    var svgW = this.$('.dash-widget svg').outerWidth()
    var svgH = this.$('.dash-widget svg').outerHeight()
    // configure chart widget dimensions
    var margin = {top: 10, right: 0, bottom: 80, left: 32}
    var margin2 = {top: 20, right: 0, bottom: 10, left: 32}
    var width = svgW - margin.left - margin.right - 20
    var height = +svgH - margin.top - margin.bottom
    var height2 = +svgH - margin2.top - margin2.bottom
    var g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // set widget title
    widget.select('.title')
      .text(this.get('title'))
      .style('font-size', '.875rem')
      .style('font-weight', '100')

    // set x scale
    var x = d3.scaleTime()
      .rangeRound([0, width])
      // set y scale
    var y = d3.scaleLinear()
      .rangeRound([height, 0])
    var y2 = d3.scaleLinear()
    .rangeRound([height2, 0])

    // x axis gen
    var xAxis = d3.axisBottom(x)
    // y axis gen
    var yAxis = d3.axisLeft(y)
    var yAxis2 = d3.axisLeft(y2)

    var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on('brush end', brushed)

    var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', zoomed)

    var line = d3.line()
    .x((d) => x(d.x))
    .y((d) => y(d.y))

    var line2 = d3.line()
    .x((d) => x(d.x))
    .y((d) => y2(d.y))

    var focus = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var context = svg.append('g')
    .attr('class', 'context')
    .attr('transform', 'translate(' + margin2.left + ',' + margin2.bottom + ')')

    var graph = {}
    // fetch data and render chart content
    graph.d3json = d3.json(this.get('url'), function (error, data) {
      if (error) throw error
      // format dates and values
      var d = data.stamp.map(function (obj) {
        var o = {}
        o.x = parseTime(obj.x)
        o.y = +obj.y
        return o
      })

      x.domain(d3.extent(d.map((d) => d.x)))
      y.domain(d3.extent(d.map((d) => d.y))).rangeRound([height, 0])
      y2.domain(d3.extent(d.map((d) => d.y))).rangeRound([height2, height + 2 * margin.top])

      // append the x axis t-graph
      focus.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis.tickSize(3)
              .ticks(6)
              .tickFormat(xTime)
              )
      focus.select('.domain').remove()

      // append the y axis to t-graph
      focus.append('g')
        .call(yAxis
          .tickFormat(d3.format('.0s'))
          .tickSize(2)
          .ticks(6))
        .append('text')
        .attr('fill', '#448AFF')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('fill', '#90A4AE')
        .text('bits')
      focus.select('.domain').remove()

      // append path with data
      focus.append('path')
      .datum(d)
      .attr('fill', 'none')
      .attr('stroke', '#E91E63')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1)
      .attr('d', line)

      // append x axis to b-graph
      context.append('g')
        .attr('transform', 'translate(0,' + height2 + ')')
        .call(xAxis.tickSize(3)
              .ticks(8)
              .tickFormat(xTime)
              )
      context.select('.domain').remove()

      // append the y axis to b-graph
      context.append('g')
        .call(yAxis2
          .tickFormat(d3.format('.0s'))
          .tickSize(2)
          .ticks(3))
        .append('text')
        .attr('fill', '#448AFF')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('fill', '#90A4AE')
        .text('bits')
      context.select('.domain').remove()

      context.append('path')
        .datum(d)
        .attr('fill', 'none')
        .attr('stroke', '#E91E63')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1)
        .attr('d', line2)
    })

    graph.render = setInterval(function () {
      d3.json('http://10.33.1.97:4242/api/series/qf-in-bps', function (error, data) {
        if (error) throw error
      // format dates and values
        var d = data.stamp.map(function (obj) {
          var o = {}
          o.x = parseTime(obj.x)
          o.y = +obj.y
          return o
        })

        x.domain(d3.extent(d.map((d) => d.x)))
        y.domain(d3.extent(d.map((d) => d.y))).rangeRound([height, 0])
        y2.domain(d3.extent(d.map((d) => d.y))).rangeRound([height2, height + 2 * margin.top])

        focus.selectAll('path').remove()
        focus.selectAll('g').remove()
        context.selectAll('path').remove()
        context.selectAll('g').remove()

        // append the x axis t-graph
        focus.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis.tickSize(3)
              .ticks(6)
              .tickFormat(xTime)
              )
        focus.select('.domain').remove()

      // append the y axis to t-graph
        focus.append('g')
        .call(yAxis
          .tickFormat(d3.format('.0s'))
          .tickSize(2)
          .ticks(6))
        .append('text')
        .attr('fill', '#448AFF')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('fill', '#90A4AE')
        .text('bits')
        focus.select('.domain').remove()

      // append path with data
        focus.append('path')
      .datum(d)
      .attr('fill', 'none')
      .attr('stroke', '#E91E63')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1)
      .attr('d', line)

      // append x axis to b-graph
        context.append('g')
        .attr('transform', 'translate(0,' + height2 + ')')
        .call(xAxis.tickSize(3)
              .ticks(8)
              .tickFormat(xTime)
              )
        context.select('.domain').remove()

      // append the y axis to b-graph
        context.append('g')
        .call(yAxis2
          .tickFormat(d3.format('.0s'))
          .tickSize(2)
          .ticks(3))
        .append('text')
        .attr('fill', '#448AFF')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('fill', '#90A4AE')
        .text('bits')
        context.select('.domain').remove()

        context.append('path')
        .datum(d)
        .attr('fill', 'none')
        .attr('stroke', '#E91E63')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1)
        .attr('d', line2)
      })
    }, 5000)

    function brushed () {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return // ignore brush-by-zoom
      var s = d3.event.selection || x2.range()
      x.domain(s.map(x2.invert, x2))
      focus.select('.area').attr('d', area)
      focus.select('.axis--x').call(xAxis)
      svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
          .scale(width / (s[1] - s[0]))
          .translate(-s[0], 0))
    }

    function zoomed () {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return // ignore zoom-by-brush
      var t = d3.event.transform
      x.domain(t.rescaleX(x2).domain())
      focus.select('.area').attr('d', area)
      focus.select('.axis--x').call(xAxis)
      context.select('.brush').call(brush.move, x.range().map(t.invertX, t))
    }
  }
})
