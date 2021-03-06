/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Liferay, Inc. nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * @ignore
 */

'use strict';

import Aggregation from '../../src/api-query/Aggregation';
import Geo from '../../src/api-query/Geo';
import Range from '../../src/api-query/Range';

describe('Aggregation', function() {
  it('should get field, operator, value and params', function() {
    const aggregation = new Aggregation('myField', 'myOperator', 'myValue', {
      param1: 'param1',
    });
    assert.strictEqual('myField', aggregation.getField());
    assert.strictEqual('myOperator', aggregation.getOperator());
    assert.strictEqual('myValue', aggregation.getValue());
    assert.deepEqual({param1: 'param1'}, aggregation.getParams());
  });

  it('should add a nested aggregation', function() {
    const aggregation = new Aggregation('myField', 'myOperator', 'myValue');
    const nestedAggregation = new Aggregation(
      'myField',
      'myOperator',
      'myValue'
    );
    aggregation.addNestedAggregation('test', nestedAggregation);

    assert.strictEqual(
      true,
      Array.isArray(aggregation.getNestedAggregations())
    );
    assert.strictEqual(1, aggregation.getNestedAggregations().length);
  });

  describe('Aggregation.avg', function() {
    it('should create an aggregation with the "avg" operator', function() {
      const aggregation = Aggregation.avg('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('avg', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.cardinality', function() {
    it('should create an aggregation with the "cardinality" operator', function() {
      const aggregation = Aggregation.cardinality('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('cardinality', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.count', function() {
    it('should create an aggregation with the "count" operator', function() {
      const aggregation = Aggregation.count('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('count', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.distance', function() {
    it('should create an aggregation with the "geoDistance" operator from location and ranges', function() {
      const aggregation = Aggregation.distance(
        'myField',
        Geo.point(10, 10),
        Range.range(0, 100),
        Range.from(200)
      );

      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('geoDistance', aggregation.getOperator());

      const value = {
        location: [10, 10],
        ranges: [
          {
            from: 0,
            to: 100,
          },
          {
            from: 200,
          },
        ],
      };
      assert.deepEqual(value, aggregation.getValue());
    });

    it('should add ranges through the "range" function', function() {
      const aggregation = Aggregation.distance(
        'myField',
        Geo.point(10, 10),
        Range.range(0, 100)
      );
      aggregation.range(Range.from(200)).range(-200, -100);

      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('geoDistance', aggregation.getOperator());

      const value = {
        location: [10, 10],
        ranges: [
          {
            from: 0,
            to: 100,
          },
          {
            from: 200,
          },
          {
            from: -200,
            to: -100,
          },
        ],
      };
      assert.deepEqual(value, aggregation.getValue());
    });

    it('should set the aggregation unit through the "unit" function', function() {
      const aggregation = Aggregation.distance(
        'myField',
        Geo.point(10, 10),
        Range.range(0, 100)
      );
      aggregation.unit('km');

      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('geoDistance', aggregation.getOperator());

      const value = {
        location: [10, 10],
        ranges: [
          {
            from: 0,
            to: 100,
          },
        ],
        unit: 'km',
      };
      assert.deepEqual(value, aggregation.getValue());
    });
  });

  describe('Aggregation.extendedStats', function() {
    it('should create an aggregation with the "extendedStats" operator', function() {
      const aggregation = Aggregation.extendedStats('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('extendedStats', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.histogram', function() {
    it('should create an aggregation with the "histogram" operator', function() {
      const aggregation = Aggregation.histogram('myField', 10);
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('histogram', aggregation.getOperator());
      assert.strictEqual(10, aggregation.getValue());
    });

    it('should create an aggregation with the "histogram" operator and bucket ordering', function() {
      const aggregation = Aggregation.histogram(
        'myField',
        10,
        null,
        Aggregation.BucketOrder.count('desc')
      );
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('histogram', aggregation.getOperator());
      assert.deepEqual(
        {order: [{asc: false, key: '_count'}]},
        aggregation.getParams()
      );
      assert.strictEqual(10, aggregation.getValue());
    });

    it('should create an aggregation with the "date_histogram" operator', function() {
      const aggregation = Aggregation.histogram('myField', 'month');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('date_histogram', aggregation.getOperator());
      assert.strictEqual('month', aggregation.getValue());
    });

    it('should create an aggregation with the "date_histogram" operator and time unit', function() {
      const aggregation = Aggregation.histogram('myField', 5, 'd');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('date_histogram', aggregation.getOperator());
      assert.strictEqual('5d', aggregation.getValue());
    });

    it('should create an aggregation with the "date_histogram" operator, time unit and bucket ordering', function() {
      const aggregation = Aggregation.histogram(
        'myField',
        5,
        'd',
        Aggregation.BucketOrder.count('desc')
      );
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('date_histogram', aggregation.getOperator());
      assert.deepEqual(
        {order: [{asc: false, key: '_count'}]},
        aggregation.getParams()
      );
      assert.strictEqual('5d', aggregation.getValue());
    });
  });

  describe('Aggregation.max', function() {
    it('should create an aggregation with the "max" operator', function() {
      const aggregation = Aggregation.max('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('max', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.min', function() {
    it('should create an aggregation with the "min" operator', function() {
      const aggregation = Aggregation.min('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('min', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.missing', function() {
    it('should create an aggregation with the "missing" operator', function() {
      const aggregation = Aggregation.missing('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('missing', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.range', function() {
    it('should create an aggregation with the "range" operator from ranges', function() {
      const aggregation = Aggregation.range(
        'myField',
        Range.range(0, 100),
        Range.from(200)
      );

      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('range', aggregation.getOperator());

      const value = [
        {
          from: 0,
          to: 100,
        },
        {
          from: 200,
        },
      ];
      assert.deepEqual(value, aggregation.getValue());
    });

    it('should add ranges through the "range" function', function() {
      const aggregation = Aggregation.range('myField', Range.range(0, 100))
        .range(Range.from(200))
        .range(-200, -100);

      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('range', aggregation.getOperator());

      const value = [
        {
          from: 0,
          to: 100,
        },
        {
          from: 200,
        },
        {
          from: -200,
          to: -100,
        },
      ];
      assert.deepEqual(value, aggregation.getValue());
    });
  });

  describe('Aggregation.script', function() {
    it('should create an aggregation with the "script" operator', function() {
      const aggregation = Aggregation.script('myField', '(params.avg_fa - 32)');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('script', aggregation.getOperator());
      assert.strictEqual('(params.avg_fa - 32)', aggregation.getValue());
    });

    it('should create an aggregation with the "script" operator applied to multiple fields', function() {
      const aggregation = Aggregation.script(
        ['myField1', 'myfield2'],
        '(params.avg_fa - 32)'
      );
      assert.strictEqual('myField1,myfield2', aggregation.getField());
      assert.strictEqual('script', aggregation.getOperator());
      assert.strictEqual('(params.avg_fa - 32)', aggregation.getValue());
    });
  });

  describe('Aggregation.stats', function() {
    it('should create an aggregation with the "stats" operator', function() {
      const aggregation = Aggregation.stats('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('stats', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.sum', function() {
    it('should create an aggregation with the "sum" operator', function() {
      const aggregation = Aggregation.sum('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('sum', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.terms', function() {
    it('should create an aggregation with the "terms" operator', function() {
      const aggregation = Aggregation.terms('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('terms', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.field', function() {
    it('should create an aggregation', function() {
      const aggregation = Aggregation.field('myField', 'myOperator');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('myOperator', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('TermsAggregation', function() {
    it('should create an aggregation with field, size and buckerOrder', function() {
      const bucketOrder = Aggregation.BucketOrder.count('desc');
      const aggregation = new Aggregation.TermsAggregation(
        'touchpoint',
        3,
        bucketOrder
      );

      assert.strictEqual('touchpoint', aggregation.getField());
      assert.strictEqual('terms', aggregation.getOperator());
      assert.deepEqual(
        {size: 3, order: [{asc: false, key: '_count'}]},
        aggregation.getParams()
      );
      assert.strictEqual(undefined, aggregation.getValue());
    });

    it('should add buckerOrder to an aggregation', function() {
      const bucketOrder = Aggregation.BucketOrder.key('desc');
      const aggregation = new Aggregation.TermsAggregation('touchpoint');
      aggregation.addBucketOrder(bucketOrder);

      assert.strictEqual('touchpoint', aggregation.getField());
      assert.strictEqual('terms', aggregation.getOperator());
      assert.deepEqual(
        {order: [{asc: false, key: '_key'}]},
        aggregation.getParams()
      );
      assert.strictEqual(undefined, aggregation.getValue());
    });
  });
});
