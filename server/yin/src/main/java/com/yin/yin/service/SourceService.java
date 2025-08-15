package com.yin.yin.service;

import com.yin.yin.model.SourceData;
import java.util.List;

/**
 * 订单来源服务接口
 */
public interface SourceService {

    /**
     * 获取订单来源详细数据
     *
     * @param sourceId 来源ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 来源详细数据
     */
    SourceData getSourceData(String sourceId, String startDate, String endDate);

    /**
     * 获取所有订单来源的统计数据
     *
     * @return 来源统计数据列表
     */
    List<SourceData.Overview> getSourcesStatistics();
}
